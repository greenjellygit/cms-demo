import mime from 'mime-types'
import { Attachment } from 'nodemailer/lib/mailer'
import { join } from 'path'
import { AppConfig } from '../config/app.config'
import { MailAttachment, MailParam, isEmbeddedImageParam } from './mail.model'

export class MailAttachmentMapper {
    constructor(private appConfig: AppConfig) {}

    public map(attachments: MailAttachment[], params: MailParam[]): Attachment[] {
        const fileAttachments = attachments.map(({ fileName, filePath: path }) => {
            this.validateExtension(path)
            const basicFields = this.mapBasicFields(fileName, path)
            return basicFields
        })

        const embeddedImages = params
            .filter(isEmbeddedImageParam)
            .map(({ fileName, filePath: path }) => {
                this.validateExtension(path)
                const basicFields = this.mapBasicFields(fileName, path)
                return {
                    ...basicFields,
                    cid: fileName,
                }
            })

        return [...embeddedImages, ...fileAttachments]
    }

    private validateExtension(path: string) {
        const contentType = mime.lookup(path)
        const extension = mime.extension(contentType as string)

        if (!this.appConfig.allowedAttachmentExtensions.includes(extension as string)) {
            throw Error(
                `File with the extension '${extension}' is not allowed as a mail attachment`,
            )
        }
    }

    private mapBasicFields(filename: string, path: string) {
        const externalFile = path.startsWith('http')
        const rootDirectory = this.appConfig.appRootDirectory
        const filePath = externalFile ? path : join(rootDirectory, path)
        return {
            filename,
            path: filePath,
        }
    }
}
