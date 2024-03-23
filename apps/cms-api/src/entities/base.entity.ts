import { BeforeUpdate, Opt, PrimaryKey, Property } from '@mikro-orm/core'
import { randomUUID } from 'crypto'

export abstract class BaseEntity {
    @PrimaryKey()
    id: string = randomUUID()

    @Property()
    createdAt: Date & Opt = new Date()

    @Property({ nullable: true })
    updatedAt?: Date & Opt

    @BeforeUpdate()
    public setUpdatedAt() {
        this.updatedAt = new Date()
    }
}
