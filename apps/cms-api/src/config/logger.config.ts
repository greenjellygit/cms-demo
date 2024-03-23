import { createLogger, format, transports } from 'winston'

const errorStackTracerFormat = format((info) => {
    const splats = [...(info[Symbol.for('splat')] || [])]
    const errors = [
        info.stack,
        ...splats.filter((splat: unknown) => splat instanceof Error),
    ].filter((e) => !!e)
    if (errors.length > 0 && info.level === 'ERROR') {
        const joinedStacks = errors.map((e) => e.stack).join('\n')
        info.message = `${info.message}\n${joinedStacks}`
    }
    return info
})

export const formatter = format.combine(
    format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    errorStackTracerFormat(),
    format.splat(),
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
