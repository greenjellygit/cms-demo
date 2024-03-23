import 'reflect-metadata'
import { AppConfig } from '../config/app.config'
import { DbAccess } from '../config/db.config'
import { MailAttachmentEntity } from '../entities/mail-attachment.entity'
import {
    MailParamEmbeddedImageEntity,
    MailParamEntity,
    MailParamTextEntity,
    MailParamType,
} from '../entities/mail-param.entity'
import { MailEntity } from '../entities/mail.entity'
import { MailAttachments, MailBase, MailParams, isEmbeddedImageParam } from './mail.model'

export class MailStorage {
    private appConfig: AppConfig
    private db: DbAccess

    constructor(appConfig: AppConfig, db: DbAccess) {
        this.appConfig = appConfig
        this.db = db
    }

    public createEntity(mailBase: MailBase): MailEntity {
        const params: MailParamEntity[] = this.mapParams(mailBase?.params || {})
        const attachments: MailAttachmentEntity[] = this.mapAttachments(mailBase.attachments || {})
        return this.db.mails.create({
            type: mailBase.type,
            subject: mailBase.subject,
            emailFrom: this.appConfig.mailFrom,
            emailTo: mailBase.recipientEmail,
            params,
            attachments,
        })
    }

    public mapToDefinition(mailEntity: MailEntity): MailBase {
        const params = mailEntity.params.getItems().reduce((accumulator, param) => {
            if (param instanceof MailParamEmbeddedImageEntity) {
                accumulator[param.name] = {
                    fileName: param.fileName,
                    filePath: param.filePath,
                }
            } else if (param instanceof MailParamTextEntity) {
                accumulator[param.name] = param.text
            } else {
                throw new Error('Cannot map mail param from entity to definition')
            }
            return accumulator
        }, {} as MailParams)
        const attachments = mailEntity.attachments.getItems().reduce((accumulator, attachment) => {
            accumulator[attachment.name] = {
                fileName: attachment.fileName,
                filePath: attachment.filePath,
            }
            return accumulator
        }, {} as MailAttachments)
        return {
            type: mailEntity.type,
            subject: mailEntity.subject,
            recipientEmail: mailEntity.emailTo,
            attachments,
            params,
        }
    }

    private mapAttachments(attachments: MailAttachments): MailAttachmentEntity[] {
        return Object.entries(attachments).map(([name, value]) =>
            this.db.mailAttachments.create({
                name,
                fileName: value.fileName,
                filePath: value.filePath,
            }),
        )
    }

    private mapParams(params: MailParams): MailParamEntity[] {
        return Object.entries(params).map(([name, value]) => {
            if (isEmbeddedImageParam(value)) {
                return this.db.mailEmbeddedImageParams.create({
                    type: MailParamType.EMBEDDED_IMAGE,
                    name,
                    fileName: value.fileName,
                    filePath: value.filePath,
                })
            }
            return this.db.mailTextParams.create({
                type: MailParamType.TEXT,
                name,
                text: value,
            })
        })
    }
}
