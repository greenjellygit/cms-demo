import { UserCreate, UserOut } from '@cms/model'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { SchemaError } from '../core/request.validator'
import { app, server, untilAppReady } from './test-app'

beforeAll(async () => {
    await untilAppReady(server)
})

afterAll(() => {
    server.close()
})

describe('/users', () => {
    it('should get users (empty)', async () => {
        const response = await request(app).get('/api/users')
        expect(response.statusCode).toBe(StatusCodes.OK)
        expect(response.body).toStrictEqual([])
    })
    it('should create user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ userName: 'John' } as UserCreate)
        expect(response.statusCode).toBe(StatusCodes.OK)
        expect(response.body).not.toBeNull()

        const user: UserOut = response.body[0]
        expect(user.id).not.toBeNull()
        expect(user.name).toEqual('John')
        expect(user.registrationDate).not.toBeNull()
    })
    it('should validate user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ userName: 'jo' } as UserCreate)
        expect(response.statusCode).toBe(StatusCodes.PRECONDITION_FAILED)
        expect(response.body).toEqual<[SchemaError]>([
            {
                prop: 'userName',
                errors: { isLength: 'userName must be longer than or equal to 3 characters' },
                children: [],
            },
        ])
    })
    it('should get users (not empty)', async () => {
        const response = await request(app).get('/api/users')
        expect(response.statusCode).toBe(StatusCodes.OK)
        expect(response.body).not.toBeNull()

        const user: UserOut = response.body[0]
        expect(user.id).not.toBeNull()
        expect(user.name).toEqual('John')
        expect(user.registrationDate).not.toBeNull()
    })
})
