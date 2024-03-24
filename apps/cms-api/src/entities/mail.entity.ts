import { Collection, Entity, Enum, OneToMany, Opt, Property } from '@mikro-orm/core'
import { MailType } from '../mail/templates/definitions'
import { MailEntityRepository } from '../repositories/mail-entity.repository'
import { AuditedEntity } from './audited.entity'
import { MailAttachmentEntity } from './mail-attachment.entity'
import { MailParamEntity } from './mail-param.entity'

export enum MailStatus {
    NEW = 'NEW',
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    FAIL = 'FAIL',
    ERROR = 'ERROR',
}

@Entity({ tableName: 'mails', repository: () => MailEntityRepository })
export class MailEntity extends AuditedEntity {
    @Enum(() => MailType)
    type!: MailType

    @Property()
    subject!: string

    @Property()
    emailFrom!: string

    @Property()
    emailTo!: string

    @OneToMany(() => MailParamEntity, (mailParam) => mailParam.mailId)
    params = new Collection<MailParamEntity>(this)

    @OneToMany(() => MailAttachmentEntity, (mailAttachment) => mailAttachment.mailId)
    attachments = new Collection<MailAttachmentEntity>(this)

    @Property()
    attemptCount: number & Opt = 0

    @Property()
    @Enum(() => MailStatus)
    status: MailStatus & Opt = MailStatus.NEW

    @Property({ nullable: true })
    errorMessage?: string & Opt
}
