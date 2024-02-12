import { Router } from 'express'
import { router as userRouter } from './routers/user.router'

export const routers = Router()

routers.use('/users', userRouter)
