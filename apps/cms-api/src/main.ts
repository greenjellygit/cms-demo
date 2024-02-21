import { startApp } from './app'
import mySqlConfig from './config/db.config'
import { EnvFile } from './config/settings'

export const { app, server } = startApp({ envFile: EnvFile.ENV, dbConfig: mySqlConfig })
