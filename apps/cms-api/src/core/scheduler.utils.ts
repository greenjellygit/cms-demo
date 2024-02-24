import cron from 'node-cron'
import 'reflect-metadata'
import { getAppConfig } from '../config/app.config'
import { appLogger } from '../config/logger.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => any

export function onInstanceCreation<TBase extends Constructor>(callback: (constr: TBase) => void) {
    return (Base: TBase) =>
        class extends Base {
            constructor(...args: ConstructorParameters<Constructor>) {
                super(...args)
                callback(Base)
            }
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

        if (getAppConfig().enableScheduler) {
            const schedulerName = constr.name
            cronDefinitions.forEach(({ cronExpression, cronJob, cronName }) => {
                cron.schedule(cronExpression, () => {
                    appLogger.info(`[${schedulerName}] ${cronName} - started`)
                    cronJob()
                })
            })
        }
    })
}
