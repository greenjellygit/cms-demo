import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { MySqlDriver } from '@mikro-orm/mysql'
import http from 'http'
import { ProductEntity } from '../entities/product.entity'
import { UserEntity } from '../entities/user.entity'
import { getAppConfig } from './app.config'
import { appLogger } from './logger.config'
import {
    CustomMigrationGenerator,
    CustomNamingStrategy,
    createCustomFileName,
} from './migrations.config'

export const defaultDbConfig: Options = {
    dbName: 'cms_demo_db',
    entities: [UserEntity, ProductEntity],
    logger: (msg) => appLogger.info(msg),
    forceUtcTimezone: true,
    extensions: [Migrator],
    namingStrategy: CustomNamingStrategy,
    migrations: {
        tableName: 'mikro_orm_migrations',
        pathTs: './src/migrations',
        generator: CustomMigrationGenerator,
        snapshot: false,
        fileName: createCustomFileName,
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

export interface DB {
    server: http.Server
    orm: MikroORM
    em: EntityManager
    users: EntityRepository<UserEntity>
    products: EntityRepository<ProductEntity>
}

export const DB = {} as DB

export const initDb = (dbConfig: Options) => {
    DB.orm = MikroORM.initSync(dbConfig)
    DB.em = DB.orm.em
    DB.users = DB.orm.em.getRepository(UserEntity)
    DB.products = DB.orm.em.getRepository(ProductEntity)
    return DB
}

export default mySqlConfig
