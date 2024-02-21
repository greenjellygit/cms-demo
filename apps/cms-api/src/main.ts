import { startApp } from './app'
import { EnvFile } from './config/app.config'
import mySqlConfig from './config/db.config'

export const { app, server } = startApp({ envFile: EnvFile.ENV, dbConfig: mySqlConfig })
