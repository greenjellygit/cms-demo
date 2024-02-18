import { logger } from '../config/logger.config'
import { Schedule } from '../core/scheduler.utils'

export default class MailScheduler {
    @Schedule('* * * * * *')
    public resendEmails() {
        logger.info('Sending emails...')
    }
}
