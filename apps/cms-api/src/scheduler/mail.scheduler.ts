import { DbAccess } from '../config/db.config'
import { Job, Scheduler } from '../core/scheduler.utils'
import { MailStatus } from '../entities/mail.entity'
import { MailDispatcher } from '../mail/mail-dispatcher'

@Scheduler()
export default class MailScheduler {
    constructor(private db: DbAccess) {}

    @Job('*/10 * * * * *')
    public async retryFailedMails(): Promise<void> {
        const failedMails = await this.db.mails.find(
            { status: MailStatus.FAIL },
            { populate: ['params', 'attachments'] },
        )
        failedMails.forEach((mail) => {
            MailDispatcher.getInstance().trySendMail(mail, this.db.em)
        })
    }
}
