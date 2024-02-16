import { startApp } from './app'
import mySqlConfig from './db.config'

export const { app, server } = startApp(mySqlConfig)
