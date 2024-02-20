import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { HttpException } from '../../core/http.exception'

export const testRouter = Router()

testRouter.get('/exception', () => {
    throw new Error('some exception')
})
testRouter.get('/promise-rejection', async () => {
    await Promise.reject(new Error('some rejected promise'))
})
testRouter.get('/http-exception', () => {
    throw new HttpException({
        message: 'some http exception',
        statusCode: HttpStatusCode.ImATeapot,
    })
})
