import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity {
    @Property()
    login: string
}
