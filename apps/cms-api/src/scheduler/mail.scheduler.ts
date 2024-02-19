import { logger } from '../config/logger.config'
import { Job, Scheduler } from '../core/scheduler.utils'

@Scheduler()
export default class MailScheduler {
    @Job('* * * * * *')
    public task1(): void {
        logger.info('Running task 1')
    }

    @Job('0 * * * *')
    public task2(): void {
        logger.info('Running task 2')
    }

    public notAJob(): void {
        logger.info('Not a task')
    }
}
