import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'
import { MailEntity } from './mail.entity'

@Entity({
    tableName: 'mail_attachments',
})
export class MailAttachmentEntity extends BaseEntity {
    @ManyToOne({ name: 'mail_id', entity: () => MailEntity, mapToPk: true })
    mailId?: string

    @Property()
    name!: string

    @Property()
    fileName!: string

    @Property()
    filePath!: string
}
