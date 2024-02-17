import { Options, RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import express from 'express'
import * as path from 'path'
// eslint-disable-next-line
import 'express-async-errors'
import { initDb } from './db.config'
import { globalErrorHandler, httpLogger, logger } from './logger.config'
import { routers } from './routers'

export function startApp(dbConfig: Options) {
    const app = express()

    const DB = initDb(dbConfig)

    app.use((_req, _res, next) => RequestContext.create(DB.orm.em, next))
    app.use(cors())
    app.use(express.json())
    app.use(httpLogger)

    app.use('/assets', express.static(path.join(__dirname, 'assets')))
    app.use('/api', routers)

    app.use(globalErrorHandler)

    const port = process.env.PORT || 3333
    const server = app.listen(port, () => {
        server.emit('ready')
        logger.info(`Api started at http://localhost:${port}`)
    })
    server.on('error', logger.error)

    return { app, server }
}
