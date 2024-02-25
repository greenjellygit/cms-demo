import cls from 'cls-hooked'
import express, { NextFunction } from 'express'

const reqContextStorage = cls.createNamespace('per-request-session')

export class RequestContext {
    private req: express.Request

    constructor(req: express.Request) {
        this.req = req
    }

    public getUserId(): string {
        return this.req?.session?.userId
    }
}

export class RequestContextProvider {
    static get(): RequestContext {
        return reqContextStorage.get('req')
    }
}

export function handleRequestContext(
    req: express.Request,
    _res: express.Response,
    next: NextFunction,
) {
    reqContextStorage.run(() => {
        reqContextStorage.set('req', new RequestContext(req))
        next()
    })
}
