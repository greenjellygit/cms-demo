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
}

export const settings: Settings = {} as Settings

export const loadSettings = (path?: string): void => {
    Object.keys(settings).forEach((key) => delete (settings as any)[key])
    const loadedConfig = mapToDto(
        Settings,
        path
            ? dotnev.config({ path, override: true, debug: true }).parsed
            : dotnev.config({ debug: true, override: true }).parsed,
    )
    Object.assign(settings, loadedConfig)
}
