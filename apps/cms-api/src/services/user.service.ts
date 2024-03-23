import { UserRegister } from '@cms/model'
import { sql } from '@mikro-orm/core'
import { HttpStatusCode } from 'axios'
import { DB } from '../config/db.config'
import { appLogger } from '../config/logger.config'
import { PasswordUtils } from '../core/password.utils'
import { UserEntity } from '../entities/user.entity'
import { HttpException } from '../exceptions/http.exception'
import { MailDispatcher } from '../mail/mail-dispatcher'
import { MailType } from '../mail/templates/definitions'

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

    await MailDispatcher.getInstance().dispatchEmail({
        type: MailType.REGISTRATION,
        recipientEmail: email,
        subject: 'Welcome to ShoppingListApp!',
        params: {
            registrationLink: 'http://localhost:3333/dupa',
            recipientName: 'John',
            someImageUrl:
                'https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg',
            welcomeImage: {
                fileName: 'avatar.png',
                filePath: '/assets/avatar.png',
            },
        },
        attachments: {
            rules: {
                fileName: 'avatar.gif',
                filePath: '/resources/avatar.gif',
            },
            externalFile: {
                fileName: 'external_file.gif',
                filePath: 'https://cdn.pixabay.com/animation/2023/02/16/09/00/09-00-47-382_512.gif',
            },
        },
    })
}
