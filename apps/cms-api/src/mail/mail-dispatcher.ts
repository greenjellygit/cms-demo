import { EntityManager } from '@mikro-orm/core'
import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { AppConfig, getAppConfig } from '../config/app.config'
import { DB, DbAccess } from '../config/db.config'
import { appLogger } from '../config/logger.config'
import { MailEntity, MailStatus } from '../entities/mail.entity'
import { MailAttachmentMapper } from './mail-attachment.mapper'
import { MailBodyBuilder, TemplateBuilder } from './mail-builder'
import { MailStorage } from './mail-storage'
import { MailContent } from './mail.model'
import { MailDefinition, templateCreators } from './templates/definitions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MailDispatcher<AnyMailDefinition extends MailContent<any, any, any>> {
    // eslint-disable-next-line no-use-before-define
    private static instance?: MailDispatcher<MailDefinition>
    private mailer: Transporter

    public constructor(
        private appConfig: AppConfig,
        private mailBodyBuilder: MailBodyBuilder,
        private mailStorage: MailStorage,
        private db: DbAccess,
    ) {
        this.mailer = nodemailer.createTransport({
            service: appConfig.smtpService,
            host: appConfig.smtpHost,
            port: appConfig.smtpPort,
            secure: true,
            auth: {
                user: appConfig.smtpAuthUser,
                pass: appConfig.smtpAuthPass,
            },
        })
    }

    static getInstance(): MailDispatcher<MailDefinition> {
        if (!MailDispatcher.instance) {
            const appConfig = getAppConfig()
            MailDispatcher.instance = new MailDispatcher(
                getAppConfig(),
                new MailBodyBuilder(
                    new MailAttachmentMapper(appConfig),
                    new TemplateBuilder(templateCreators),
                ),
                new MailStorage(appConfig, DB),
                DB,
            )
        }
        return MailDispatcher.instance
    }

    static deleteInstance(): void {
        delete MailDispatcher.instance
    }

    public async dispatchEmail(mailDefinition: AnyMailDefinition) {
        const mailEntity = this.mailStorage.createEntity(mailDefinition)
        await this.db.em.flush()
        await this.trySendMail(mailEntity, this.db.em)
    }

    public async trySendMail(mailEntity: MailEntity, em: EntityManager) {
        if (mailEntity.status === MailStatus.ERROR) {
            appLogger.warn('Cannot send mail with id: %s, status is ERROR')
            return
        }
        em.assign(mailEntity, {
            status: MailStatus.PENDING,
            attemptCount: mailEntity.attemptCount + 1,
        })
        await em.flush()

        try {
            const mailOptions = this.prepareMailOptions(mailEntity)
            if (this.appConfig.mailDispatcherEnabled) {
                appLogger.info(
                    'Starting sending mail of type %s to %s...',
                    mailEntity.type,
                    mailOptions.to,
                )
                const info = await this.mailer.sendMail(mailOptions)
                appLogger.info(
                    'Mail of type %s to %s sent, info: %s',
                    mailEntity.type,
                    mailOptions.to,
                    info?.response,
                )
            } else {
                appLogger.warn(
                    'Mail dispatcher is not enabled, attempt of sending mail of type %s to %s was skipped',
                    mailEntity.type,
                    mailOptions.to,
                )
            }

            em.assign(mailEntity, { status: MailStatus.SUCCESS })
            await em.flush()
        } catch (error) {
            appLogger.error(
                'Error sending email with type %s to %s:',
                mailEntity.type,
                mailEntity.emailTo,
                error,
            )

            em.assign(mailEntity, {
                errorMessage: (error as Error).message,
                status:
                    mailEntity.attemptCount >= this.appConfig.mailMaxAttempts
                        ? MailStatus.ERROR
                        : MailStatus.FAIL,
            })
            await em.flush()
        }
    }

    private prepareMailOptions(mailEntity: MailEntity): Mail.Options {
        const mailDefinition = this.mailStorage.mapToDefinition(mailEntity)
        const mailBody = this.mailBodyBuilder.build(
            mailDefinition.type,
            mailDefinition.params || {},
            mailDefinition.attachments || {},
        )

        return {
            from: mailEntity.emailFrom,
            to: mailEntity.emailTo,
            subject: mailEntity.subject,
            html: mailBody.html,
            attachments: mailBody.attachments,
        }
    }

    public getMailer(): Transporter {
        return this.mailer
    }
}
