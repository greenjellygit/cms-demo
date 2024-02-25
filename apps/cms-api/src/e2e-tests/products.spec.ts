// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductCreate } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { ProductEntity } from '../entities/product.entity'

describe('/products', () => {
    it('should /products create a new product and store who created record', async () => {
        const response = await ctx.authorizedApiClient
            .post('/api/products')
            .send({ name: 'Apple' } as ProductCreate)

        expect(response.statusCode).toBe(HttpStatusCode.Created)
        expect(response.body.id).not.toBe(null)
        expect(response.body.name).toBe('Apple')

        const products = await ctx.DB.products.findAll()
        expect(products.length).toBe(1)

        const product: ProductEntity = products[0]
        expect(product.id).not.toBeNull()
        expect(product.name).toBe('Apple')
        expect(product.createdAt).not.toBeNull()
        expect(product.createdBy).toBe(ctx.authorizedApiClient.userId)
    })
})
