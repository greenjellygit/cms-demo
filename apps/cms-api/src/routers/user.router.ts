import { UserCreate, UserOut } from '@cms/model'
import { Response, Router } from 'express'
import { mapToDto } from '../core/mapper.utils'
import { TypRequest, TypResponse, validate } from '../core/request.validator'
import * as userService from '../services/user.service'

export const router = Router()

router.get('/', async (req: TypRequest<void>, res: Response<UserOut[]>) => {
    const users = await userService.getUsers()
    const usersOut = mapToDto(UserOut, users)
    res.send(usersOut)
})

router.post(
    '/',
    validate(UserCreate),
    async (req: TypRequest<UserCreate>, res: TypResponse<UserOut[]>) => {
        const users = await userService.createUser(req.body)
        const usersOut = mapToDto(UserOut, users)
        res.send(usersOut)
    },
)
