import { Router } from 'express'
import { TypRequest, TypResponse } from '../core/request.validator'

export const router = Router()

router.get('/', async (req: TypRequest<void>, res: TypResponse<string>) => {
    const token = req.csrfToken && req.csrfToken()
    res.send(token)
})
