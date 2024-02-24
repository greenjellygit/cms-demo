import { appLogger } from '../config/logger.config'
import { Job, Scheduler } from '../core/scheduler.utils'

@Scheduler()
export default class MailScheduler {
    @Job('* * * * * *')
    public task1(): void {
        appLogger.info('Running task 1')
    }

    @Job('0 * * * *')
    public task2(): void {
        appLogger.info('Running task 2')
    }

    public notAJob(): void {
        appLogger.info('Not a task')
    }
}
