import { BaseTemplateCreator, EmbeddedImageParam, MailAttachment, MailContent } from '../mail.model'
import { buildRegistrationTemplate } from './registration-email.template'
import { buildRequestResetPasswordTemplate } from './request-reset-password.template'
import { buildResetPasswordConfirmationTemplate } from './reset-password-confirmation.template'

export enum MailType {
    REGISTRATION = 'REGISTRATION',
    REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD',
    RESET_PASSWORD_CONFIRMATION = 'RESET_PASSWORD_CONFIRMATION',
}

export type RegistrationMail = MailContent<
    MailType.REGISTRATION,
    {
        recipientName: string
        registrationLink: string
        someImageUrl: string
        welcomeImage: EmbeddedImageParam
    },
    { rules: MailAttachment; externalFile: MailAttachment }
>
export type RequestResetPasswordMail = MailContent<
    MailType.REQUEST_RESET_PASSWORD,
    { param1: EmbeddedImageParam }
>
export type ResetPasswordConfirmationMail = MailContent<
    MailType.RESET_PASSWORD_CONFIRMATION,
    { param2: string }
>

export type MailDefinition =
    | RegistrationMail
    | RequestResetPasswordMail
    | ResetPasswordConfirmationMail

export type MailTemplateCreator<T extends MailType> = BaseTemplateCreator<T, MailDefinition>

export const templateCreators: { [K in MailType]: MailTemplateCreator<K> } = {
    [MailType.REGISTRATION]: buildRegistrationTemplate,
    [MailType.REQUEST_RESET_PASSWORD]: buildRequestResetPasswordTemplate,
    [MailType.RESET_PASSWORD_CONFIRMATION]: buildResetPasswordConfirmationTemplate,
}
