import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core'
import { MySqlDriver } from '@mikro-orm/mysql'
import http from 'http'
import { UserEntity } from './entities/user.entity'

export const DB = {} as {
    server: http.Server
    orm: MikroORM
    em: EntityManager
    users: EntityRepository<UserEntity>
}

export const initDb = async () => {
    DB.orm = await MikroORM.init({
        entities: [UserEntity],
        dbName: 'cms_demo_db',
        clientUrl: 'jdbc:mysql://localhost:3306',
        user: 'root',
        password: 'root',
        driver: MySqlDriver,
        forceUtcTimezone: true,
    })
    DB.em = DB.orm.em
    DB.users = DB.orm.em.getRepository(UserEntity)
    return DB
}
