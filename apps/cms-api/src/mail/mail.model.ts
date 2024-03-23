import { MJMLParseResults } from 'mjml-core'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type MailAttachment = { fileName: string; filePath: string }
export type EmbeddedImageParam = { fileName: string; filePath: string }
export type MailAttachments = Record<string, MailAttachment>
export type MailParam = string | EmbeddedImageParam
export type MailParams = Record<string, MailParam>

type IfNonVoid<T, B> = T extends void ? object : B
export type MailBase<T = any, P = MailParams, A = MailAttachments> = {
    type: T
    recipientEmail: string
    subject: string
    params?: P
    attachments?: A
}
export type BaseTemplateCreator<T, P extends MailBase<unknown, MailParams, unknown>> = (
    params: Extract<P, { type: T }>['params'],
) => MJMLParseResults
export type AnyTemplateCreators = Record<string, BaseTemplateCreator<unknown, any>>
export type MailContent<
    T = any,
    P extends MailParams | void = void,
    A extends MailAttachments | void = void,
> = MailBase<T, P, A> & IfNonVoid<P, { params: P }> & IfNonVoid<A, { attachments: A }>

export const isEmbeddedImageParam = (param: MailParam): param is EmbeddedImageParam =>
    !!(param as EmbeddedImageParam).fileName && !!(param as EmbeddedImageParam).filePath
