import { AuthCredentials } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { TypRequest, TypResponse, validate } from '../core/request.validator'
import * as authService from '../services/session.service'

export const router = Router()

router.post(
    '/',
    validate(AuthCredentials),
    async (req: TypRequest<AuthCredentials>, res: TypResponse<void>) => {
        await authService.authenticate(req)
        res.sendStatus(HttpStatusCode.Created)
    },
)

router.delete('/', async (req: TypRequest<void>, res: TypResponse<void>) => {
    await authService.deleteSession(req)
    res.clearCookie('SID', { path: '/' }).sendStatus(HttpStatusCode.Ok)
})
