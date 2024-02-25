import { UserOut, UserRegister } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { mapToDto } from '../core/mapper.utils'
import { TypRequest, TypResponse, validate } from '../core/request.validator'
import * as userService from '../services/user.service'

export const router = Router()

router.post(
    '/register',
    validate(UserRegister),
    async (req: TypRequest<UserRegister>, res: TypResponse<void>) => {
        await userService.register(req.body)
        res.status(HttpStatusCode.Created).end()
    },
)

router.get('/me', async (req: TypRequest<void>, res: TypResponse<UserOut>) => {
    const user = await userService.getUserById(req.session.userId)
    const userOut = mapToDto(UserOut, user)
    res.send(userOut)
})
