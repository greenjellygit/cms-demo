import { EntityManager, MikroORM } from '@mikro-orm/core'
import { SqliteDriver } from '@mikro-orm/sqlite'
import Mail from 'nodemailer/lib/mailer'
import { AppConfig } from '../config/app.config'
import { DbAccess, defaultDbConfig } from '../config/db.config'
import { MailAttachmentEntity } from '../entities/mail-attachment.entity'
import { MailParamEmbeddedImageEntity, MailParamTextEntity } from '../entities/mail-param.entity'
import { MailEntity } from '../entities/mail.entity'
import { MailBodyBuilder } from './mail-builder'
import { MailDispatcher } from './mail-dispatcher'
import { MailStorage } from './mail-storage'
import { MailDefinition } from './templates/definitions'

let db: DbAccess

beforeAll(() => {
    const orm = MikroORM.initSync({ ...defaultDbConfig, connect: false, driver: SqliteDriver })
    const em = orm.em.fork()
    db = {
        em: { flush: jest.fn(), assign: jest.fn() } as unknown as EntityManager,
        mails: em.getRepository(MailEntity),
        mailTextParams: em.getRepository(MailParamTextEntity),
        mailEmbeddedImageParams: em.getRepository(MailParamEmbeddedImageEntity),
        mailAttachments: em.getRepository(MailAttachmentEntity),
    } as DbAccess
})

describe('MailDispatcher', () => {
    it('should configure mailer when dispatcher instance created', () => {
        // given
        const appConfig = {
            appRootDirectory: '/root/',
            mailDispatcherEnabled: true,
            smtpHost: 'smtp_host',
            smtpAuthUser: 'smtp_auth_user',
            smtpAuthPass: 'smtp_auth_pass',
            smtpPort: 9999,
            smtpService: 'smpt_service',
            mailFrom: 'from@test.com',
        } as AppConfig

        // when
        const mailDispatcher = new MailDispatcher(
            appConfig,
            {} as MailBodyBuilder,
            {} as MailStorage,
            db,
        )

        // then
        expect(mailDispatcher.getMailer()).toMatchObject({
            options: {
                auth: {
                    pass: 'smtp_auth_pass',
                    user: 'smtp_auth_user',
                },
                host: 'smtp_host',
                port: 9999,
                secure: true,
                service: 'smpt_service',
            },
        })
    })

    it('should send mail using mailer', async () => {
        // given - app config
        const appConfig = {
            appRootDirectory: '/root/',
            allowedAttachmentExtensions: ['png', 'pdf'],
            mailFrom: 'hello@test.com',
            mailDispatcherEnabled: true,
        } as AppConfig

        // and - mocked mail body builder
        const mailBuilder = new (<new () => MailBodyBuilder>MailBodyBuilder)()
        mailBuilder.build = jest.fn(() => ({
            html: '<span>test</span>',
            attachments: [
                { cid: 'test', filename: 'user_photo', path: '/resources/user1.png' },
                { filename: 'rules.pdf', path: '/resources/rules.pdf' },
            ],
        }))

        // and - mocked mailer send mail function
        const mailDispatcher = new MailDispatcher(
            appConfig,
            mailBuilder,
            new MailStorage(appConfig, db),
            db,
        )
        mailDispatcher.getMailer().sendMail = jest.fn()

        // when
        await mailDispatcher.dispatchEmail({
            recipientEmail: 'recipient@test.com',
            subject: 'Test subject',
        } as MailDefinition)

        // then
        expect(mailBuilder.build).toHaveBeenCalledTimes(1)
        expect(mailDispatcher.getMailer().sendMail).toHaveBeenCalledWith({
            from: 'hello@test.com',
            to: 'recipient@test.com',
            subject: 'Test subject',
            html: '<span>test</span>',
            attachments: [
                {
                    cid: 'test',
                    filename: 'user_photo',
                    path: '/resources/user1.png',
                },
                {
                    filename: 'rules.pdf',
                    path: '/resources/rules.pdf',
                },
            ],
        } as Mail.Options)
    })

    it('should skip mail sending when dispatcher is disabled in configuration', async () => {
        // given - app config
        const appConfig = {
            appRootDirectory: '/root/',
            allowedAttachmentExtensions: ['png', 'pdf'],
            mailFrom: 'hello@test.com',
            mailDispatcherEnabled: false,
        } as AppConfig

        // and - mocked mail builder, mail storage
        const mailBuilder = new (<new () => MailBodyBuilder>MailBodyBuilder)()
        mailBuilder.build = jest.fn(() => ({
            html: '<span>test</span>',
            attachments: [
                { cid: 'test', filename: 'user_photo', path: '/resources/user1.png' },
                { filename: 'rules.pdf', path: '/resources/rules.pdf' },
            ],
        }))

        const mailStorage = new (<new () => MailStorage>MailStorage)()
        mailStorage.createEntity = jest.fn(() => ({}) as MailEntity)
        mailStorage.mapToDefinition = jest.fn(() => ({
            type: 'TEST_TYPE',
            params: {},
            attachments: {},
            recipientEmail: 'recipient@test.com',
            subject: 'Test subject',
        }))

        // and - mocked mailer send mail function
        const mailDispatcher = new MailDispatcher(appConfig, mailBuilder, mailStorage, db)
        mailDispatcher.getMailer().sendMail = jest.fn()

        // when
        await mailDispatcher.dispatchEmail({} as MailDefinition)

        // then
        expect(mailBuilder.build).toHaveBeenCalledTimes(1)
        expect(mailDispatcher.getMailer().sendMail).toHaveBeenCalledTimes(0)
    })
})
