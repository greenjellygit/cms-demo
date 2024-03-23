import { MJMLParseResults } from 'mjml-core'
import { AppConfig } from '../config/app.config'
import { MailAttachmentMapper } from './mail-attachment.mapper'
import { MailBodyBuilder, TemplateBuilder } from './mail-builder'
import {
    BaseTemplateCreator,
    EmbeddedImageParam,
    MailAttachment,
    MailAttachments,
    MailContent,
    MailParams,
} from './mail.model'

enum MailType {
    TEST_MAIL = 'TEST_MAIL',
    MISSING_CREATOR_TEMPLATE = 'MISSING_CREATOR_TEMPLATE',
}

type TestMailDefinition = MailContent<
    MailType.TEST_MAIL,
    {
        userName: string
        userPhoto: EmbeddedImageParam
        externalImage: EmbeddedImageParam
    },
    {
        rules: MailAttachment
        externalFile: MailAttachment
    }
>

type MailTemplateCreator<T extends MailType> = BaseTemplateCreator<T, TestMailDefinition>

const testMailTemplateCreator: MailTemplateCreator<MailType.TEST_MAIL> = ({
    userName,
    userPhoto,
    externalImage,
}) =>
    ({
        errors: {},
        html: `<span>Hello ${userName}!</span><img url="cid:${userPhoto.fileName}"/><img url="cid:${externalImage.fileName}"/>`,
    }) as MJMLParseResults

const testTemplateCreators = {
    [MailType.TEST_MAIL]: testMailTemplateCreator,
}

const mailBuilder = new MailBodyBuilder(
    new MailAttachmentMapper({
        allowedAttachmentExtensions: ['png', 'pdf'],
        appRootDirectory: '/root/',
    } as AppConfig),
    new TemplateBuilder(testTemplateCreators),
)

describe('MailBuilder', () => {
    it('should build mail template along with attachments and mail data', () => {
        // given
        const mailParams: MailParams = {
            userName: 'John Smith',
            userPhoto: { fileName: 'user_photo', filePath: '/resources/user1.png' },
            externalImage: { fileName: 'external', filePath: 'https://test.com/external.png' },
        }
        const mailAttachments: MailAttachments = {
            rules: { fileName: 'rules.pdf', filePath: '/resources/rules.pdf' },
            externalFile: { fileName: 'external.pdf', filePath: 'https://test.com/external.pdf' },
        }

        // when
        const results = mailBuilder.build(MailType.TEST_MAIL, mailParams, mailAttachments)

        // then
        const {
            attachments: [
                embeddedLocalImage,
                embeddedExternalImage,
                localDocument,
                externalDocument,
            ],
            ...mailData
        } = results

        expect(mailData).toStrictEqual({
            html: '<span>Hello John Smith!</span><img url="cid:user_photo"/><img url="cid:external"/>',
        })

        expect(results.attachments.length).toBe(4)
        expect(embeddedLocalImage).toStrictEqual({
            cid: 'user_photo',
            filename: 'user_photo',
            path: '\\root\\resources\\user1.png',
        })
        expect(embeddedExternalImage).toStrictEqual({
            cid: 'external',
            filename: 'external',
            path: 'https://test.com/external.png',
        })
        expect(localDocument).toStrictEqual({
            filename: 'rules.pdf',
            path: '\\root\\resources\\rules.pdf',
        })
        expect(externalDocument).toStrictEqual({
            filename: 'external.pdf',
            path: 'https://test.com/external.pdf',
        })
    })

    it('should throw exception when template builder returns errors', () => {
        // given
        const mailParams: MailParams = {
            userName: 'John Smith',
            userPhoto: { fileName: 'user_photo', filePath: '/resources/user1.png' },
            externalImage: { fileName: 'external', filePath: 'https://test.com/external.png' },
        }
        const mailAttachments: MailAttachments = {
            rules: { fileName: 'rules.pdf', filePath: '/resources/rules.pdf' },
            externalFile: { fileName: 'external.pdf', filePath: 'https://test.com/external.pdf' },
        }
        testTemplateCreators.TEST_MAIL = () =>
            ({ errors: [{ line: 2, message: 'something went wrong' }] }) as MJMLParseResults

        // when
        const results = () => mailBuilder.build(MailType.TEST_MAIL, mailParams, mailAttachments)

        // then
        expect(results).toThrow('Cannot build mail template')
    })

    it('should throw exception when template creator is missing', () => {
        // when
        const results = () => mailBuilder.build(MailType.MISSING_CREATOR_TEMPLATE, {}, {})

        // then
        expect(results).toThrow('Cannot find creator for the MISSING_CREATOR_TEMPLATE template')
    })
})
