import expressWinston from 'express-winston'
import { transports } from 'winston'
import { formatter } from '../config/logger.config'

export const httpLogger = expressWinston.logger({
    transports: [new transports.Console()],
    msg: 'HTTP {{req.method}} {{req.url}} - {{res.statusCode}}',
    format: formatter,
})
