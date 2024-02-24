import { UserRegister } from '@cms/model'
import { sql } from '@mikro-orm/core'
import { HttpStatusCode } from 'axios'
import { DB } from '../config/db.config'
import { appLogger } from '../config/logger.config'
import { PasswordUtils } from '../core/password.utils'
import { UserEntity } from '../entities/user.entity'
import { HttpException } from '../exceptions/http.exception'

export async function getUserById(id: string): Promise<UserEntity> {
    return DB.users.findOneOrFail({ id })
}

export async function register({ email, password }: UserRegister): Promise<void> {
    const user = await DB.users.findOne({ [sql`trim(lower(email))`]: email.trim().toLowerCase() })

    if (user) {
        appLogger.error(`User with login '${email}' doesn not exist`)
        throw new HttpException({
            message: 'User with this email aready exists',
            statusCode: HttpStatusCode.PreconditionFailed,
        })
    }

    const hashedPassword = await PasswordUtils.hash(password)
    DB.users.create({
        email,
        password: hashedPassword,
    })
    await DB.em.flush()
}
