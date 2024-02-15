import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations'
import { MySqlDriver, Options } from '@mikro-orm/mysql'
import http from 'http'
import { UserEntity } from './entities/user.entity'

const config: Options = {
    entities: [UserEntity],
    dbName: 'cms_demo_db',
    clientUrl: 'jdbc:mysql://localhost:3306',
    user: 'root',
    password: 'root',
    driver: MySqlDriver,
    forceUtcTimezone: true,
    extensions: [Migrator],
    migrations: {
        tableName: 'mikro_orm_migrations',
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

export const DB = {} as {
    server: http.Server
    orm: MikroORM
    em: EntityManager
    users: EntityRepository<UserEntity>
}

export const initDb = async () => {
    DB.orm = await MikroORM.init(config)
    DB.em = DB.orm.em
    DB.users = DB.orm.em.getRepository(UserEntity)
    return DB
}

export default config
