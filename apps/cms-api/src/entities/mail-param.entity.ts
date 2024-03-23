import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'
import { MailEntity } from './mail.entity'

export enum MailParamType {
    TEXT = 'TEXT',
    EMBEDDED_IMAGE = 'EMBEDDED_IMAGE',
}

@Entity({
    tableName: 'mail_params',
    discriminatorColumn: 'type',
    abstract: true,
})
export abstract class MailParamEntity extends BaseEntity {
    @Enum(() => MailParamType)
    type!: MailParamType

    @Property()
    name!: string

    @ManyToOne({ name: 'mail_id', entity: () => MailEntity, mapToPk: true })
    mailId?: string
}

@Entity({ discriminatorValue: MailParamType.TEXT })
export class MailParamTextEntity extends MailParamEntity {
    @Property({ type: 'text' })
    text!: string
}

@Entity({ discriminatorValue: MailParamType.EMBEDDED_IMAGE })
export class MailParamEmbeddedImageEntity extends MailParamEntity {
    @Property()
    fileName!: string

    @Property()
    filePath!: string
}
