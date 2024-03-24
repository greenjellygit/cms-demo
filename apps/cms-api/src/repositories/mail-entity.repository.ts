import { EntityRepository } from '@mikro-orm/core'
import { MailEntity, MailStatus } from '../entities/mail.entity'

export class MailEntityRepository extends EntityRepository<MailEntity> {
    public findFailed() {
        return this.find({ status: MailStatus.FAIL }, { populate: ['params', 'attachments'] })
    }
}
