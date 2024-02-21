import { Options, RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import express, { Router } from 'express'
import * as path from 'path'
// eslint-disable-next-line
import 'express-async-errors'
import { initDb } from './config/db.config'
import { globalErrorHandler, httpLogger, logger } from './config/logger.config'
import { EnvFile, getSettings } from './config/settings'
import { routers } from './routers'
import { startSchedulers } from './scheduler'

type AppParams = {
    dbConfig: Options
    envFile?: EnvFile
    additionalRouters?: { prefix: string; router: Router }[]
}

export function startApp({ envFile, dbConfig, additionalRouters = [] }: AppParams) {
    const app = express()

    getSettings(envFile)
    const DB = initDb(dbConfig)
    startSchedulers()

    app.use((_req, _res, next) => RequestContext.create(DB.orm.em, next))
    app.use(cors())
    app.use(express.json())
    app.use(httpLogger)

    app.use('/assets', express.static(path.join(__dirname, 'assets')))
    app.use('/api', routers)
    additionalRouters.forEach(({ prefix, router }) => {
        app.use(prefix, router)
    })

    app.use(globalErrorHandler)

    const port = process.env.PORT || 3333
    const server = app.listen(port, () => {
        server.emit('ready')
        logger.info(`Api started at http://localhost:${port}`)
    })
    server.on('error', logger.error)

    return { app, server }
}
