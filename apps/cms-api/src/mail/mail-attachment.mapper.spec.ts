import { AppConfig } from '../config/app.config'
import { MailAttachmentMapper } from './mail-attachment.mapper'
import { EmbeddedImageParam, MailParam } from './mail.model'

describe('MailAttachmentMapper', () => {
    it('should allow to map attachments to nodemailer attachment type', () => {
        const mailAttachmentMapper = new MailAttachmentMapper({
            allowedAttachmentExtensions: ['png', 'txt', 'pdf', 'gif'],
            appRootDirectory: '/root/',
        } as AppConfig)

        const params: EmbeddedImageParam[] = [
            {
                fileName: 'some_file.pdf',
                filePath: '/resources/some_file.pdf',
            },
            {
                fileName: 'some_external_file.txt',
                filePath: 'https://test.com/assets/some_external_file.txt',
            },
        ]

        const [localFile, externalFile] = mailAttachmentMapper.map(params, [])

        expect(localFile).toStrictEqual({
            filename: 'some_file.pdf',
            path: '\\root\\resources\\some_file.pdf',
        })

        expect(externalFile).toStrictEqual({
            filename: 'some_external_file.txt',
            path: 'https://test.com/assets/some_external_file.txt',
        })
    })

    it('should allow to map embedded image params to nodemailer attachment type', () => {
        const mailAttachmentMapper = new MailAttachmentMapper({
            allowedAttachmentExtensions: ['png', 'txt', 'pdf', 'gif'],
            appRootDirectory: '/root/',
        } as AppConfig)

        const params: MailParam[] = [
            {
                fileName: 'some_image.gif',
                filePath: '/resources/image.gif',
            },
            {
                fileName: 'some_external_image.png',
                filePath: 'https://test.com/assets/some_external_image.png',
            },
            'this param should be skipped',
        ]

        const [localImage, externalImage, ...others] = mailAttachmentMapper.map([], params)

        expect(others.length).toBe(0)
        expect(localImage).toStrictEqual({
            cid: 'some_image.gif',
            filename: 'some_image.gif',
            path: '\\root\\resources\\image.gif',
        })

        expect(externalImage).toStrictEqual({
            filename: 'some_external_image.png',
            path: 'https://test.com/assets/some_external_image.png',
            cid: 'some_external_image.png',
        })
    })

    describe('should not allow to use files different than allowed', () => {
        const mailAttachmentMapper = new MailAttachmentMapper({
            allowedAttachmentExtensions: ['png', 'txt', 'pdf', 'gif'],
            appRootDirectory: '/root/',
        } as AppConfig)

        const params = [
            {
                fileName: 'test.exe',
                filePath: '/resources/test.exe',
                expected: "File with the extension 'exe' is not allowed as a mail attachment",
            },
            {
                fileName: 'test.zip',
                filePath: '/resources/test.zip',
                expected: "File with the extension 'zip' is not allowed as a mail attachment",
            },
            {
                fileName: 'test.jpg',
                filePath: '/resources/test.jpg',
                expected: "File with the extension 'jpeg' is not allowed as a mail attachment",
            },
            {
                fileName: 'test.png',
                filePath: '/resources/test.png',
                expected: null,
            },
            {
                fileName: 'test.gif',
                filePath: '/resources/test.gif',
                expected: null,
            },
            {
                fileName: 'test.pdf',
                filePath: '/resources/test.pdf',
                expected: null,
            },
        ]

        test.each(params)('$path -> $expected', ({ expected, ...param }) => {
            const result = () => mailAttachmentMapper.map([], [param])
            if (expected === null) {
                expect(result).not.toThrow()
            } else {
                expect(result).toThrow(expected as string)
            }
        })
    })
})
