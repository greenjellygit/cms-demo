import { HttpStatusCode } from 'axios'
import express from 'express'
import { logger } from '../config/logger.config'
import { HttpException } from './http.exception'

export const globalErrorHandler = (
    err: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    if (err instanceof HttpException) {
        logger.error('Http exception occurred: ', err)
        res.status(err.statusCode).send(err.message)
    } else {
        logger.error('Unexpected error occurred: ', err)
        res.status(HttpStatusCode.InternalServerError).send('An unexpected error occurred')
    }
    next()
}
