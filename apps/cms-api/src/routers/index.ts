import { Router } from 'express'
import { router as userRouter } from './user.router'

export const routers = Router()

routers.use('/users', userRouter)
