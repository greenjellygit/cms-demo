// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserCreate, UserOut } from '@cms/model'
import { HttpStatusCode } from 'axios'
import request from 'supertest'
import { SchemaError } from '../core/request.validator'

describe('/users', () => {
    it('should get users (empty)', async () => {
        const response = await request(global.app).get('/api/users')
        expect(response.statusCode).toBe(HttpStatusCode.Ok)
        expect(response.body).toStrictEqual([])
    })
    it('should create user', async () => {
        const response = await request(global.app)
            .post('/api/users')
            .send({ login: 'John' } as UserCreate)
        expect(response.statusCode).toBe(HttpStatusCode.Ok)
        expect(response.body).not.toBeNull()

        const user: UserOut = response.body[0]
        expect(user.id).not.toBeNull()
        expect(user.login).toEqual('John')
        expect(user.createdAt).not.toBeNull()
    })
    it('should return internal server error', async () => {
        const response = await request(global.app)
            .post('/api/users')
            .send({ login: 'John' } as UserCreate)
        expect(response.statusCode).toBe(HttpStatusCode.InternalServerError)
    })
    it('should validate user', async () => {
        const response = await request(global.app)
            .post('/api/users')
            .send({ login: 'jo' } as UserCreate)
        expect(response.statusCode).toBe(HttpStatusCode.PreconditionFailed)
        expect(response.body).toEqual<[SchemaError]>([
            {
                prop: 'login',
                errors: { isLength: 'login must be longer than or equal to 3 characters' },
                children: [],
            },
        ])
    })
    it('should get users (not empty)', async () => {
        const response = await request(global.app).get('/api/users')
        expect(response.statusCode).toBe(HttpStatusCode.Ok)
        expect(response.body).not.toBeNull()

        const user: UserOut = response.body[0]
        expect(user.id).not.toBeNull()
        expect(user.login).toEqual('John')
        expect(user.createdAt).not.toBeNull()
    })
})
