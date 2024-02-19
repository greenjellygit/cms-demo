import { Expose } from 'class-transformer'
import dotnev from 'dotenv'
import { Boolean, mapToDto } from '../core/mapper.utils'

export class Settings {
    @Boolean()
    @Expose({ name: 'ENABLE_SCHEDULER' })
    enableScheduler: boolean
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
