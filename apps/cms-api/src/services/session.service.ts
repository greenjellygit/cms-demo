import { AuthCredentials } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { DB } from '../config/db.config'
import { appLogger } from '../config/logger.config'
import { PasswordUtils } from '../core/password.utils'
import { TypRequest } from '../core/request.validator'
import { HttpException } from '../exceptions/http.exception'

export async function authenticate(req: TypRequest<AuthCredentials>): Promise<void> {
    const { email, password } = req.body

    const user = await DB.users.findOne({ email })
    const invalidCredentialsException = new HttpException({
        message: 'Invalid credentials',
        statusCode: HttpStatusCode.Unauthorized,
    })

    if (!user) {
        appLogger.error(`User with email '${email}' does not exists`)
        throw invalidCredentialsException
    }

    if (!(await PasswordUtils.verify(password, user.password))) {
        appLogger.error(`Wrong password for user with email: '${email}'`)
        throw invalidCredentialsException
    }
    req.session.authenticated = true
    req.session.userId = user.id
}

export function deleteSession(req: TypRequest<void>): void {
    req.session.destroy((err) => {
        if (err) {
            appLogger.error('Cannot destroy session: ', err)
        } else {
            req.session = {} as never
            appLogger.info(`Session deleted`)
        }
    })
}
