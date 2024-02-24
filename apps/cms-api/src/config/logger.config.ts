import { createLogger, format, transports } from 'winston'

const errorStackTracerFormat = format((info) => {
    const logInfo = info
    if (logInfo.stack && logInfo.level === 'ERROR') {
        logInfo.message = `${logInfo.message} \n ${logInfo.stack}`
    }
    return info
})

export const formatter = format.combine(
    format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    errorStackTracerFormat(),
    format.colorize({ all: true }),
    format.label({ label: '[LOG]' }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.simple(),
    format.printf((info) => `${info.label} ${info.timestamp} ${info.level}: ${info.message}`),
)

export const appLogger = createLogger({
    transports: [new transports.Console()],
    format: formatter,
})
