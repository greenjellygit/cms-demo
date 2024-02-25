import { Router } from 'express'
import { router as csrfRouter } from './csrf.router'
import { router as productRouter } from './product.router'
import { router as sessionRouter } from './session.router'
import { router as userRouter } from './user.router'

export const rootRouters = Router()

rootRouters.use('/csrf-token', csrfRouter)

export const apiRouters = Router()

apiRouters.use('/users', userRouter)
apiRouters.use('/sessions', sessionRouter)
apiRouters.use('/products', productRouter)
