import { Opt, PrimaryKey, Property } from '@mikro-orm/core'
import { randomUUID } from 'crypto'

export abstract class BaseEntity {
    @PrimaryKey()
    id: string = randomUUID()

    @Property()
    createdAt: Date & Opt = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date & Opt = new Date()
}
