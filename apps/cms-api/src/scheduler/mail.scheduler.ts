import { DbAccess } from '../config/db.config'
import { Job, Scheduler } from '../core/scheduler.utils'
import { MailDispatcher } from '../mail/mail-dispatcher'

@Scheduler()
export default class MailScheduler {
    constructor(private db: DbAccess) {}

    @Job('*/10 * * * * *')
    public async retryFailedMails(): Promise<void> {
        const failedMails = await this.db.mails.findFailed()
        failedMails.forEach((mail) => {
            MailDispatcher.getInstance().trySendMail(mail, this.db.em)
        })
    }
}
