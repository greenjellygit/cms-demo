import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core'
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations'
import { MySqlDriver } from '@mikro-orm/mysql'
import http from 'http'
import { UserEntity } from '../entities/user.entity'
import { getAppConfig } from './app.config'
import { logger } from './logger.config'

export const defaultDbConfig: Options = {
    dbName: 'cms_demo_db',
    entities: [UserEntity],
    logger: (msg) => logger.info(msg),
    forceUtcTimezone: true,
    extensions: [Migrator],
    migrations: {
        tableName: 'mikro_orm_migrations',
        pathTs: './src/migrations',
        generator: TSMigrationGenerator,
        snapshot: false,
        fileName: (timestamp: string, name?: string) => {
            if (!name) {
                throw new Error(
                    'Specify migration name via `mikro-orm migration:create --name=...`',
                )
            }

            return `${timestamp}_${name}`
        },
    },
}

const config = getAppConfig()
const mySqlConfig: Options = {
    clientUrl: `jdbc:mysql://${config.dbPath}`,
    user: config.dbUser,
    password: config.dbPass,
    driver: MySqlDriver,
    ...defaultDbConfig,
}

export const DB = {} as {
    server: http.Server
    orm: MikroORM
    em: EntityManager
    users: EntityRepository<UserEntity>
}

export const initDb = (dbConfig: Options) => {
    DB.orm = MikroORM.initSync(dbConfig)
    DB.em = DB.orm.em
    DB.users = DB.orm.em.getRepository(UserEntity)
    return DB
}

export default mySqlConfig
