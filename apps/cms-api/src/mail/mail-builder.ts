import { MJMLParseResults } from 'mjml-core'
import { Attachment } from 'nodemailer/lib/mailer'
import { appLogger } from '../config/logger.config'
import { MailAttachmentMapper } from './mail-attachment.mapper'
import { AnyTemplateCreators, MailAttachments, MailParams } from './mail.model'

interface MailBody {
    html: string
    attachments: Attachment[]
}

export class TemplateBuilder {
    constructor(private creators: AnyTemplateCreators) {}

    public build(mailType: string, mailParams: MailParams): MJMLParseResults {
        const creatorFunction = this.creators[mailType]
        if (!creatorFunction) {
            throw Error(`Cannot find creator for the ${mailType} template`)
        }
        return creatorFunction(mailParams)
    }
}

export class MailBodyBuilder {
    constructor(
        private attachmentMapper: MailAttachmentMapper,
        private templateBuilder: TemplateBuilder,
    ) {}

    public build(type: string, mailParams: MailParams, mailAttachments: MailAttachments): MailBody {
        const template = this.templateBuilder.build(type, mailParams)
        if (template.errors?.length > 0) {
            appLogger.error('Error building mail template: %s', JSON.stringify(template.errors))
            throw new Error('Cannot build mail template')
        }

        const mappedAttachments = this.attachmentMapper.map(
            Object.values(mailAttachments),
            Object.values(mailParams),
        )

        return {
            html: template.html,
            attachments: mappedAttachments,
        }
    }
}
