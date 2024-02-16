import { Options, RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import express from 'express'
import * as path from 'path'
import { initDb } from './db.config'
import { routers } from './routers'

export function startApp(dbConfig: Options) {
    const app = express()

    const DB = initDb(dbConfig)
    app.use((req, res, next) => RequestContext.create(DB.orm.em, next))

    app.use(cors())
    app.use(express.json())

    app.use('/assets', express.static(path.join(__dirname, 'assets')))
    app.use('/api', routers)

    const port = process.env.PORT || 3333
    const server = app.listen(port, () => {
        server.emit('ready', null)
        console.log(`Api started at http://localhost:${port}`)
    })
    server.on('error', console.error)

    return { app, server }
}
