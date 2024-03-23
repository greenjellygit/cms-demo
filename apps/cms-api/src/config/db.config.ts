import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core'
import { Migrator } from '@mikro-orm/migrations'
import { MySqlDriver } from '@mikro-orm/mysql'
import { MailAttachmentEntity } from '../entities/mail-attachment.entity'
import {
    MailParamEmbeddedImageEntity,
    MailParamEntity,
    MailParamTextEntity,
} from '../entities/mail-param.entity'
import { MailEntity } from '../entities/mail.entity'
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
    entities: [
        UserEntity,
        ProductEntity,
        MailEntity,
        MailParamEntity,
        MailParamTextEntity,
        MailParamEmbeddedImageEntity,
        MailAttachmentEntity,
    ],
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

export interface DbAccess {
    orm: MikroORM
    em: EntityManager
    users: EntityRepository<UserEntity>
    products: EntityRepository<ProductEntity>
    mails: EntityRepository<MailEntity>
    mailTextParams: EntityRepository<MailParamTextEntity>
    mailEmbeddedImageParams: EntityRepository<MailParamEmbeddedImageEntity>
    mailAttachments: EntityRepository<MailAttachmentEntity>
    fork: () => DbAccess
}

export const DB = {} as DbAccess

const createDbAccess = (orm: MikroORM, em: EntityManager): DbAccess => ({
    orm,
    em,
    users: em.getRepository(UserEntity),
    products: em.getRepository(ProductEntity),
    mails: em.getRepository(MailEntity),
    mailTextParams: em.getRepository(MailParamTextEntity),
    mailEmbeddedImageParams: em.getRepository(MailParamEmbeddedImageEntity),
    mailAttachments: em.getRepository(MailAttachmentEntity),
    fork: () => createDbAccess(orm, em.fork()) as DbAccess,
})

export const initDb = (dbConfig: Options) => {
    const orm = MikroORM.initSync(dbConfig)
    Object.assign(DB, createDbAccess(orm, orm.em))
    return DB
}

export default mySqlConfig
