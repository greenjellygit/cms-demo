/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable import/first */

import { register } from 'tsconfig-paths'

register({ cwd: `${__dirname}/../../../` } as never)

import { Options } from '@mikro-orm/core'
import { AbstractSqlConnection, SqliteDriver } from '@mikro-orm/sqlite'
import express from 'express'
import { Server } from 'http'
import { Agent } from 'supertest'
import { startApp } from '../../app'
import { EnvFile } from '../../config/app.config'
import { DB, defaultDbConfig } from '../../config/db.config'
import { appLogger } from '../../config/logger.config'
import { testRouter } from './test.router'

declare global {
    var app: express.Express
    var server: Server
    var DB: DB
    var apiClient: Agent
    var authorizedApiClient: Agent
}

export const sqliteConfig: Options = {
    clientUrl: 'sqlite://',
    driver: SqliteDriver,
    ...defaultDbConfig,
    allowGlobalContext: true,
    migrations: {
        ...defaultDbConfig.migrations,
        pathTs: `${__dirname}/../../migrations`,
    },
}

async function dropAllTables() {
    const conn = DB.em.getConnection() as AbstractSqlConnection
    const knex = conn.getKnex()
    const tables = await knex.raw(
        "SELECT * FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite%';",
    )
    tables.forEach(async ({ name }: { name: string }) => {
        await knex.raw(`drop table '${name}'`)
    })
}

export const untilAppReady = (server: Server): Promise<void> =>
    new Promise((resolve) => {
        server.on('ready', async () => {
            const migrator = DB.orm.getMigrator()
            const pendingMigrations = await migrator.getPendingMigrations()
            appLogger.info(`Executing ${pendingMigrations.length} db migrations...`)
            await dropAllTables()
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
    global.DB = DB
}
