import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
    @Property({ unique: true })
    email: string

    @Property()
    password: string
}
