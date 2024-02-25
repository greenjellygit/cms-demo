import { Expose, Type } from 'class-transformer'
import { IsNumber } from 'class-validator'
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
    @IsNumber()
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
            dotnev.config({ path: envFile, override: true, debug: true }).parsed,
        )
    }
}

export const getAppConfig = (): AppConfig => {
    if (Object.keys(config.settings).length === 0) {
        loadAppConfig()
    }
    return config.settings
}
