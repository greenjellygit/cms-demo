import { User, UserCreate } from '@cms/model'
import { Response, Router } from 'express'
import {
    TypedRequest as TypRequest,
    TypedResponse as TypResponse,
    validate,
} from '../core/request.validator'
import * as userService from '../services/user.service'

export const router = Router()

router.get('/', (req: TypRequest<void>, res: Response<User[]>) => {
    res.send(userService.getUsers())
})

router.post('/', validate(UserCreate), (req: TypRequest<UserCreate>, res: TypResponse<User[]>) => {
    res.send(userService.createUser(req.body))
})
