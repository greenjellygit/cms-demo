import { Expose, Type } from 'class-transformer'
import { IsNumber } from 'class-validator'
import dotnev from 'dotenv'
import 'reflect-metadata'
import { Boolean, mapToDto } from '../core/mapper.utils'

export class AppConfig {
    @Boolean()
    @Expose({ name: 'ENABLE_SCHEDULER' })
    enableScheduler: boolean

    @Expose({ name: 'JWT_SECRET' })
    jwtSecret: string

    @Type(() => Number)
    @IsNumber()
    @Expose({ name: 'JWT_EXPIRE_TIME' })
    jwtExpireTime: number

    @Expose({ name: 'DB_PATH' })
    dbPath: string

    @Expose({ name: 'DB_USER' })
    dbUser: string

    @Expose({ name: 'DB_PASS' })
    dbPass: string
}

interface LoadedAppConfig {
    path: string
    settings: AppConfig
}

const config: LoadedAppConfig = {
    path: '',
    settings: {} as AppConfig,
}

export enum EnvFile {
    ENV = '.env',
    TEST_ENV = '.env.test',
}

export const getAppConfig = (envFile: EnvFile = EnvFile.ENV): AppConfig => {
    if (config.path !== envFile) {
        config.path = envFile
        config.settings = mapToDto(
            AppConfig,
            dotnev.config({ path: envFile, override: true, debug: true }).parsed,
        )
    }
    return config.settings
}
