import { HttpStatusCode } from 'axios'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { logger } from '../config/logger.config'
import { getSettings } from '../config/settings'
import { HttpException } from '../core/http.exception'

export interface TokenData {
    userId: number
}

export function createAccessToken(data: TokenData): string {
    const settings = getSettings()
    return jwt.sign(data, settings.jwtSecret, { expiresIn: settings.jwtExpireTime })
}

export function verifyToken(token: string): TokenData {
    const tokenException = new HttpException({
        statusCode: HttpStatusCode.Forbidden,
        message: 'Could not validate credentials',
    })
    try {
        const decoded = jwt.verify(token, getSettings().jwtSecret) as JwtPayload
        if (decoded?.userId) {
            return { userId: decoded?.userId }
        }
        throw tokenException
    } catch (err) {
        logger.error('Exception during token validation', err)
        throw tokenException
    }
}
