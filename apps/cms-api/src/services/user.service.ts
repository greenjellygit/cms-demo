import { UserCreate } from '@cms/model'
import { DB } from '../db.config'
import { UserEntity } from '../entities/user.entity'

export function getUsers(): Promise<UserEntity[]> {
    return DB.users.findAll()
}

export async function createUser(userCreate: UserCreate): Promise<UserEntity[]> {
    DB.users.create({
        login: userCreate.userName,
    })
    await DB.em.flush()
    return DB.users.findAll()
}
