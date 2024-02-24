// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserRegister } from '@cms/model'
import { HttpStatusCode } from 'axios'
import request from 'supertest'
import { SchemaError } from '../core/request.validator'
import { UserEntity } from '../entities/user.entity'

describe('/users', () => {
    it('should /register create a new user', async () => {
        const response = await request(global.app)
            .post('/api/users/register')
            .send({ email: 'john@test.com', password: 'Test123@' } as UserRegister)
        expect(response.statusCode).toBe(HttpStatusCode.Created)
        expect(response.body).toStrictEqual({})

        const users = await DB.users.findAll()
        expect(users.length).toBe(1)

        const user: UserEntity = users[0]
        expect(user.id).not.toBeNull()
        expect(user.email).toEqual('john@test.com')
        expect(user.createdAt).not.toBeNull()
    })

    it('should /register not allow to create user with the same email', async () => {
        const response = await request(global.app)
            .post('/api/users/register')
            .send({ email: 'john@test.com', password: 'Test123@' } as UserRegister)

        expect(response.statusCode).toBe(HttpStatusCode.PreconditionFailed)
        expect(response.text).toBe('User with this email aready exists')

        const users = await DB.users.findAll()
        expect(users.length).toBe(1)
    })

    it('should /register validate registration request', async () => {
        const response = await request(global.app)
            .post('/api/users/register')
            .send({ email: 'jo' } as UserRegister)

        expect(response.statusCode).toBe(HttpStatusCode.PreconditionFailed)
        expect(response.body).toEqual<SchemaError[]>([
            {
                prop: 'email',
                errors: {
                    isEmail: 'email must be an email',
                    isLength: 'email must be longer than or equal to 3 characters',
                },
                children: [],
            },
            {
                prop: 'password',
                errors: {
                    isNotEmpty: 'password should not be empty',
                    minLength: 'password must be longer than or equal to 8 characters',
                },
                children: [],
            },
        ])
    })
})
