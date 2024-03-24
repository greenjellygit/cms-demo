import cron from 'node-cron'
import 'reflect-metadata'
import { getAppConfig } from '../config/app.config'
import { appLogger } from '../config/logger.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any

export function onInstanceCreation<TBase extends Constructor>(
    callback: (constr: InstanceType<TBase>) => void,
) {
    return (Base: TBase) =>
        class extends Base {
            constructor(...args: ConstructorParameters<Constructor>) {
                super(...args)
                callback(this as InstanceType<TBase>)
            }
        }
}

export function Job(cronExpression: string) {
    return (target: object, propertyKey: string) => {
        Reflect.defineMetadata('job', { cronExpression }, target, propertyKey)
    }
}

export function Scheduler() {
    return onInstanceCreation((instance) => {
        const prototype = Object.getPrototypeOf(Object.getPrototypeOf(instance))
        const cronDefinitions = Reflect.ownKeys(prototype)
            .filter((propertyKey) => Reflect.hasMetadata('job', prototype, propertyKey))
            .map((propertyKey) => {
                const metadata = Reflect.getMetadata('job', prototype, propertyKey)
                return {
                    cronExpression: metadata.cronExpression,
                    cronJob: prototype[propertyKey].bind(instance),
                    cronName: propertyKey as string,
                }
            })

        if (getAppConfig().enableScheduler) {
            const schedulerName = prototype.constructor.name
            cronDefinitions.forEach(({ cronExpression, cronJob, cronName }) => {
                cron.schedule(cronExpression, () => {
                    appLogger.info(`[${schedulerName}] Executing scheduled job [${cronName}]`)
                    cronJob()
                })
            })
        }
    })
}
