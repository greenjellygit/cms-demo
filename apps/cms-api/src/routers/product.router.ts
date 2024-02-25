import { ProductCreate, ProductOut } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { Router } from 'express'
import { mapToDto } from '../core/mapper.utils'
import { TypRequest, TypResponse, validate } from '../core/request.validator'
import * as productService from '../services/product.service'

export const router = Router()

router.post(
    '/',
    validate(ProductCreate),
    async (req: TypRequest<ProductCreate>, res: TypResponse<ProductOut>) => {
        const product = await productService.create(req.body)
        const productOut = mapToDto(ProductOut, product)
        res.status(HttpStatusCode.Created).send(productOut)
    },
)
