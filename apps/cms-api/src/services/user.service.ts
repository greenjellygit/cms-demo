import { UserCreate } from '@cms/model'
import { DB } from '../config/db.config'
import { UserEntity } from '../entities/user.entity'

export function getUsers(): Promise<UserEntity[]> {
    return DB.users.findAll()
}

export async function createUser(userCreate: UserCreate): Promise<UserEntity[]> {
    DB.users.create({
        login: userCreate.login,
    })
    await DB.em.flush()
    return DB.users.findAll()
}
