import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { HttpException } from '../../exceptions/http.exception'

export const testRouter = Router()

testRouter.get('/exception', () => {
    throw new Error('some exception')
})
testRouter.get('/promise-rejection', async () => {
    await Promise.reject(new Error('some rejected promise'))
})
testRouter.get('/http-exception', () => {
    throw new HttpException({
        message: 'Some http exception',
        statusCode: HttpStatusCode.ImATeapot,
    })
})
