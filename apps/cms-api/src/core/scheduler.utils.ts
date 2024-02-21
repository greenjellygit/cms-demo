import cron from 'node-cron'
import 'reflect-metadata'
import { logger } from '../config/logger.config'
import { getSettings } from '../config/settings'

export const onInstanceCreation =
    (callback: (constr: any) => void) =>
    <T extends { new (...args: any[]): any }>(constr: T) =>
        class extends constr {
            constructor(...args: any[]) {
                super(...args)
                callback(constr)
            }
        }

export function Job(cronExpression: string) {
    return (target: object, propertyKey: string) => {
        Reflect.defineMetadata('job', { cronExpression }, target, propertyKey)
    }
}

export function Scheduler() {
    return onInstanceCreation((constr) => {
        const cronDefinitions = Reflect.ownKeys(constr.prototype)
            .filter((propertyKey) => Reflect.hasMetadata('job', constr.prototype, propertyKey))
            .map((propertyKey) => {
                const metadata = Reflect.getMetadata('job', constr.prototype, propertyKey)
                return {
                    cronExpression: metadata.cronExpression,
                    cronJob: constr.prototype[propertyKey],
                    cronName: propertyKey as string,
                }
            })

        if (getSettings().enableScheduler) {
            const schedulerName = constr.name
            cronDefinitions.forEach(({ cronExpression, cronJob, cronName }) => {
                cron.schedule(cronExpression, () => {
                    logger.info(`[${schedulerName}] ${cronName} - started`)
                    cronJob()
                })
            })
        }
    })
}
