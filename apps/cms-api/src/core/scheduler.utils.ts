import cron from 'node-cron'
import { logger } from '../config/logger.config'

export function Schedule(cronExpression: string) {
    return (target: any, jobName: string, descriptor: PropertyDescriptor) => {
        const schedulerName = target.constructor.name
        cron.schedule(cronExpression, () => {
            logger.info(`[${schedulerName}] ${jobName} - started`)
            descriptor.value()
        })
    }
}
