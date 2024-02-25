import { BeforeCreate, Opt, Property } from '@mikro-orm/core'
import { RequestContextProvider } from '../middlewares/request-context.middleware'
import { BaseEntity } from './base.entity'

export abstract class AuditedEntity extends BaseEntity {
    @Property({ nullable: false })
    createdBy: string & Opt

    @BeforeCreate()
    public setCreatedBy() {
        const requestContext = RequestContextProvider.get()
        this.createdBy = requestContext.getUserId()
    }
}
