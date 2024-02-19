import { startApp } from './app'
import mySqlConfig from './config/db.config'

export const { app, server } = startApp({ dbConfig: mySqlConfig })
