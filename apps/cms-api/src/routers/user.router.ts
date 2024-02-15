import { UserCreate, UserOut } from '@cms/model'
import { Response, Router } from 'express'
import {
    TypedRequest as TypRequest,
    TypedResponse as TypResponse,
    validate,
} from '../core/request.validator'
import * as userService from '../services/user.service'

export const router = Router()

router.get('/', async (req: TypRequest<void>, res: Response<UserOut[]>) => {
    const users = await userService.getUsers()
    res.send(
        users.map((user) => ({
            id: user.id,
            name: user.login,
            registrationDate: user.createdAt,
        })),
    )
})

router.post(
    '/',
    validate(UserCreate),
    async (req: TypRequest<UserCreate>, res: TypResponse<UserOut[]>) => {
        const users = await userService.createUser(req.body)
        res.send(
            users.map((user) => ({
                id: user.id,
                name: user.login,
                registrationDate: user.createdAt,
            })),
        )
    },
)
