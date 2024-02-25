import { AuthCredentials } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { TypRequest, TypResponse, validate } from '../core/request.validator'
import { SESSION_COOKIE_NAME } from '../middlewares/session-handler.middleware'
import * as authService from '../services/session.service'

export const router = Router()

router.post(
    '/',
    validate(AuthCredentials),
    async (req: TypRequest<AuthCredentials>, res: TypResponse<void>) => {
        await authService.authenticate(req)
        res.status(HttpStatusCode.Created).end()
    },
)

router.delete('/', async (req: TypRequest<void>, res: TypResponse<void>) => {
    await authService.deleteSession(req)
    res.clearCookie(SESSION_COOKIE_NAME).status(HttpStatusCode.Ok).end()
})
