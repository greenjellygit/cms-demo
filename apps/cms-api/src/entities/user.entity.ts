import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
    @Property({ nullable: false, unique: true })
    email: string

    @Property({ nullable: false })
    password: string
}
