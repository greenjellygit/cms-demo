/* eslint-disable import/first */

import { register } from 'tsconfig-paths'

register({ cwd: `${__dirname}/../../../` } as any)

import { Options } from '@mikro-orm/core'
import { SqliteDriver } from '@mikro-orm/sqlite'
import express from 'express'
import { Server } from 'http'
import { startApp } from '../../app'
import { DB, defaultDbConfig } from '../../config/db.config'
import { logger } from '../../config/logger.config'
import { EnvFile } from '../../config/settings'
import { testRouter } from './test.router'

declare global {
    // eslint-disable-next-line
    var app: express.Express
    // eslint-disable-next-line
    var server: Server
}

export const sqliteConfig: Options = {
    clientUrl: 'sqlite://',
    driver: SqliteDriver,
    ...defaultDbConfig,
    migrations: {
        ...defaultDbConfig.migrations,
        pathTs: `${__dirname}/../../migrations`,
    },
}

export const untilAppReady = (server: Server): Promise<void> =>
    new Promise((resolve) => {
        server.on('ready', async () => {
            const migrator = DB.orm.getMigrator()
            const pendingMigrations = await migrator.getPendingMigrations()
            logger.info(`Executing ${pendingMigrations.length} db migrations...`)
            await DB.orm.getSchemaGenerator().dropSchema({ dropMigrationsTable: true })
            await migrator.up()
            resolve()
        })
    })

export default async () => {
    const { app, server } = startApp({
        dbConfig: sqliteConfig,
        envFile: EnvFile.TEST_ENV,
        additionalRouters: [{ prefix: '/test', router: testRouter }],
    })
    await untilAppReady(server)
    global.app = app
    global.server = server
}
