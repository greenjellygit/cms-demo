import { Options, RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import express, { Router } from 'express'
import 'express-async-errors'
import * as path from 'path'
import { loadAppConfig } from './config/app.config'
import { initDb } from './config/db.config'
import { appLogger } from './config/logger.config'
import { checkAccess } from './middlewares/check-access.middleware'
import { csrfProtection } from './middlewares/csrf-protection.middleware'
import { errorHandler } from './middlewares/error-handler.middleware'
import { httpLogger } from './middlewares/http-logger.middleware'
import { handleRequestContext } from './middlewares/request-context.middleware'
import { sessionHandler } from './middlewares/session-handler.middleware'
import { apiRouters, rootRouters } from './routers/_index'
import { startSchedulers } from './scheduler'

export type AppParams = {
    dbConfig: Options
    envFile?: string
    additionalRouters?: { prefix: string; router: Router }[]
}

export function startApp({ envFile, dbConfig, additionalRouters = [] }: AppParams) {
    const app = express()

    loadAppConfig(envFile)
    const db = initDb(dbConfig)
    startSchedulers()

    app.use((_req, _res, next) => RequestContext.create(db.orm.em, next))
    app.use(cors({ credentials: true, origin: 'http://localhost:4200' }))
    app.use(express.json())
    app.use(httpLogger)
    app.use(sessionHandler(db.em))
    app.use(handleRequestContext)

    app.use('/assets', express.static(path.join(__dirname, 'assets')))
    app.use(csrfProtection())
    app.use('/', rootRouters)
    app.use('/api', [checkAccess], apiRouters)
    additionalRouters.forEach(({ prefix, router }) => {
        app.use(prefix, router)
    })

    app.use(errorHandler)

    const port = process.env.PORT || 3333
    const server = app.listen(port, () => {
        server.emit('ready')
        appLogger.info(`Api started at http://localhost:${port}`)
    })
    server.on('error', appLogger.error)

    return { app, server }
}
