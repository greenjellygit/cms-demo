import { HttpStatusCode } from 'axios'
import request from 'supertest'

describe('global error handler', () => {
    it('should handle exception and return response', async () => {
        const response = await request(global.app).get('/test/exception')
        expect(response.statusCode).toBe(HttpStatusCode.InternalServerError)
        expect(response.text).toBe('An unexpected error occurred')
    })

    it('should handle promise rejection and return response', async () => {
        const response = await request(global.app).get('/test/promise-rejection')
        expect(response.statusCode).toBe(HttpStatusCode.InternalServerError)
        expect(response.text).toBe('An unexpected error occurred')
    })

    it('should handle http exception and return response', async () => {
        const response = await request(global.app).get('/test/http-exception')
        expect(response.statusCode).toBe(HttpStatusCode.ImATeapot)
        expect(response.text).toBe('some http exception')
    })
})
