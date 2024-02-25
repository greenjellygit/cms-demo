import { HttpStatusCode } from 'axios'
import express from 'express'
import { HttpError } from 'http-errors'
import { getAppConfig } from '../config/app.config'
import { appLogger } from '../config/logger.config'
import { HttpException } from '../exceptions/http.exception'

export const errorHandler = (
    err: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const { logStackTrace } = getAppConfig()
    const error = logStackTrace ? err : { message: err.message }
    if (err instanceof HttpError || err instanceof HttpException) {
        appLogger.error(`Http exception occurred:`, error)
        res.status(err.statusCode).send(err.message)
    } else {
        appLogger.error('Unexpected error occurred:', error)
        res.status(HttpStatusCode.InternalServerError).send('An unexpected error occurred')
    }
    next()
}
