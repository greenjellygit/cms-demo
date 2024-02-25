import { csrfSync } from 'csrf-sync'

export const csrfProtection = () =>
    csrfSync({
        ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
        getTokenFromState: (req) => req.session.csrfToken,
        getTokenFromRequest: (req) => req.get('x-csrf-token'),
        storeTokenInState: (req, token) => {
            req.session.csrfToken = token
        },
        size: 128,
    }).csrfSynchronisedProtection
