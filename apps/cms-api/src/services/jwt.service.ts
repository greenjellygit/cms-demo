import { HttpStatusCode } from 'axios'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getAppConfig } from '../config/app.config'
import { logger } from '../config/logger.config'
import { HttpException } from '../exceptions/http.exception'

export interface TokenData {
    userId: number
}

export function createAccessToken(data: TokenData): string {
    const config = getAppConfig()
    return jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpireTime })
}

export function verifyToken(token: string): TokenData {
    const tokenException = new HttpException({
        statusCode: HttpStatusCode.Forbidden,
        message: 'Could not validate credentials',
    })
    try {
        const decoded = jwt.verify(token, getAppConfig().jwtSecret) as JwtPayload
        if (decoded?.userId) {
            return { userId: decoded?.userId }
        }
        throw tokenException
    } catch (err) {
        logger.error('Exception during token validation', err)
        throw tokenException
    }
}
