import { Entity, Property } from '@mikro-orm/core'
import { AuditedEntity } from './audited.entity'

@Entity({ tableName: 'products' })
export class ProductEntity extends AuditedEntity {
    @Property({ nullable: false })
    name: string
}
