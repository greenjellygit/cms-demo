import { Expose, Transform, Type } from 'class-transformer'
import dotnev from 'dotenv'
import 'reflect-metadata'
import { Boolean, mapToDto } from '../core/mapper.utils'

export class AppConfig {
    @Boolean()
    @Expose({ name: 'ENABLE_SCHEDULER' })
    enableScheduler: boolean

    @Expose({ name: 'SESSION_SECRET' })
    sessionSecret: string

    @Boolean()
    @Expose({ name: 'SESSION_ALLOW_HTTP' })
    sessionAllowHttp: boolean

    @Type(() => Number)
    @Expose({ name: 'SESSION_MAX_AGE' })
    sessionMaxAge: number

    @Expose({ name: 'DB_PATH' })
    dbPath: string

    @Expose({ name: 'DB_USER' })
    dbUser: string

    @Expose({ name: 'DB_PASS' })
    dbPass: string

    @Boolean()
    @Expose({ name: 'LOG_STACK_TRACE' })
    logStackTrace: boolean

    @Boolean()
    @Expose({ name: 'MAIL_DISPATCHER_ENABLED' })
    mailDispatcherEnabled: boolean

    @Expose({ name: 'MAIL_FROM' })
    mailFrom: string

    @Type(() => Number)
    @Expose({ name: 'MAIL_MAX_ATTEMPTS' })
    mailMaxAttempts: number

    @Expose({ name: 'SMTP_HOST' })
    smtpHost: string

    @Type(() => Number)
    @Expose({ name: 'SMTP_PORT' })
    smtpPort: number

    @Expose({ name: 'SMTP_SERVICE' })
    smtpService: string

    @Expose({ name: 'SMTP_AUTH_USER' })
    smtpAuthUser: string

    @Expose({ name: 'SMTP_AUTH_PASS' })
    smtpAuthPass: string

    @Transform(({ value }) => value.split('/'))
    @Expose({ name: 'ALLOWED_ATTACHMENT_EXTENSIONS' })
    allowedAttachmentExtensions: string[]

    @Expose({ name: 'APP_ROOT_DIRECTORY' })
    appRootDirectory: string = __dirname
}

const config = {
    path: '',
    settings: {} as AppConfig,
}

export const EnvFile = {
    ENV: `${__dirname}/../../.env`,
    TEST_ENV: `${__dirname}/../../.env.test`,
}

export const loadAppConfig = (envFile: string = EnvFile.ENV): void => {
    if (config.path !== envFile) {
        config.path = envFile
        config.settings = mapToDto(
            AppConfig,
            dotnev.config({ path: envFile, override: true }).parsed,
            { exposeDefaultValues: true },
        )
    }
}

export const getAppConfig = (): AppConfig => {
    if (Object.keys(config.settings).length === 0) {
        loadAppConfig()
    }
    return config.settings
}
