import { ProductCreate } from '@cms/model'
import { DB } from '../config/db.config'
import { ProductEntity } from '../entities/product.entity'

export async function create(productCreate: ProductCreate): Promise<ProductEntity> {
    const product = await DB.products.create({
        name: productCreate.name,
    })
    DB.em.flush()
    return product
}
