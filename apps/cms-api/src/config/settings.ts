import { Expose, Type } from 'class-transformer'
import { IsNumber } from 'class-validator'
import dotnev from 'dotenv'
import 'reflect-metadata'
import { Boolean, mapToDto } from '../core/mapper.utils'

export class Settings {
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

interface Config {
    path: string
    settings: Settings
}

const config: Config = {
    path: '',
    settings: {},
} as Config

export enum EnvFile {
    ENV = '.env',
    TEST_ENV = '.env.test',
}

export const getSettings = (envFile: EnvFile = EnvFile.ENV): Settings => {
    if (config.path !== envFile) {
        config.path = envFile
        config.settings = mapToDto(
            Settings,
            dotnev.config({ path: envFile, override: true, debug: true }).parsed,
        )
    }
    return config.settings
}
