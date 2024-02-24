import { HttpStatusCode } from 'axios'
import { NextFunction } from 'express'
import { TypRequest, TypResponse } from '../core/request.validator'
import { HttpException } from '../exceptions/http.exception'

export function checkAccess(req: TypRequest<void>, _res: TypResponse<void>, next: NextFunction) {
    const nonSecurePaths = ['/api/users/register', '/api/sessions']
    if (req.session.authenticated || nonSecurePaths.includes(req.originalUrl)) {
        next()
    } else {
        throw new HttpException({
            message: 'Operation not permitted',
            statusCode: HttpStatusCode.Forbidden,
        })
    }
}
