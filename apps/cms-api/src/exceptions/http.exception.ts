import { HttpStatusCode } from 'axios'

export class HttpException extends Error {
    public statusCode: HttpStatusCode

    constructor({ statusCode, message }: { statusCode: HttpStatusCode; message: string }) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}
