import { EntityManager } from '@mikro-orm/core'
import { AbstractSqlConnection } from '@mikro-orm/mysql'
import connectSessionKnex from 'connect-session-knex'
import { CsrfSyncedToken } from 'csrf-sync'
import session from 'express-session'
import { getAppConfig } from '../config/app.config'

interface SessionData {
    authenticated: boolean
    userId: string
    csrfToken: CsrfSyncedToken
}

declare module 'express-serve-static-core' {
    interface Request {
        session: session.Session & SessionData
    }
}

function initSessionStore(em: EntityManager): session.Store {
    const connection = em.getDriver().getConnection() as AbstractSqlConnection

    const KnexSessionStore = connectSessionKnex(session)
    const sessionStore = new KnexSessionStore({
        tablename: 'sessions',
        createtable: false,
        knex: connection.getKnex(),
    })
    return sessionStore
}

export const SESSION_COOKIE_NAME = 'SID'

export function sessionHandler(em: EntityManager) {
    const config = getAppConfig()
    const sessionStore = initSessionStore(em)
    return session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
        name: SESSION_COOKIE_NAME,
        cookie: {
            secure: !config.sessionAllowHttp,
            maxAge: config.sessionMaxAge,
            sameSite: 'strict',
        },
        store: sessionStore,
    })
}
