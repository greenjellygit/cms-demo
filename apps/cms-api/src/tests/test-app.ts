import { Options } from '@mikro-orm/core'
import { SqliteDriver } from '@mikro-orm/sqlite'
import { Server } from 'http'
import { startApp } from '../app'
import { DB, defaultDbConfig } from '../db.config'

export const sqliteConfig: Options = {
    clientUrl: 'sqlite://',
    driver: SqliteDriver,
    ...defaultDbConfig,
    migrations: {
        ...defaultDbConfig.migrations,
        pathTs: './apps/cms-api/src/migrations',
    },
}

export const untilAppReady = (server: Server): Promise<void> =>
    new Promise((resolve) => {
        server.on('ready', async () => {
            const migrator = DB.orm.getMigrator()
            await DB.orm.getSchemaGenerator().dropSchema({ dropMigrationsTable: true })
            await migrator.up()
            resolve()
        })
    })

export const { app, server } = startApp(sqliteConfig)
