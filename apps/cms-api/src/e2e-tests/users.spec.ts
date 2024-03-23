import { UserRegister } from '@cms/model'
import { HttpStatusCode } from 'axios'
import { SchemaError } from '../core/request.validator'
import { MailParamType } from '../entities/mail-param.entity'
import { MailEntity, MailStatus } from '../entities/mail.entity'
import { UserEntity } from '../entities/user.entity'

describe('/users', () => {
    it('should /register allow to create a new user', async () => {
        // when - request to register endpoint dispatched
        const response = await ctx.apiClient
            .post('/api/users/register')
            .send({ email: 'john@test.com', password: 'Test123@' } as UserRegister)

        // then - response is 201 CREATED
        expect(response.statusCode).toBe(HttpStatusCode.Created)
        expect(response.body).toStrictEqual({})

        // and - user is stored in DB
        const users = await ctx.DB.users.find({ email: 'john@test.com' })
        expect(users.length).toBe(1)
        expect(users[0]).toMatchObject({
            id: expect.any(String),
            email: 'john@test.com',
            password: expect.any(String),
            createdAt: expect.anything(),
        } as UserEntity)

        // and - registration mail is stored in the database
        const { params, attachments, ...mailSettings } = (await ctx.DB.mails.findOne(
            {
                emailTo: users[0].email,
            },
            { populate: ['params', 'attachments'] },
        )) as MailEntity

        expect(mailSettings).toStrictEqual({
            id: expect.any(String),
            status: MailStatus.SUCCESS,
            type: 'REGISTRATION',
            subject: 'Welcome to ShoppingListApp!',
            emailFrom: 'hello@cms-demo.com',
            emailTo: 'john@test.com',
            attemptCount: 1,
            errorMessage: null,
            createdAt: expect.anything(),
            createdBy: null,
            updatedAt: expect.any(Number),
        })

        expect(params.toArray()).toEqual([
            {
                id: expect.any(String),
                mailId: mailSettings.id,
                type: MailParamType.TEXT,
                name: 'recipientName',
                text: 'John',
                createdAt: expect.anything(),
                updatedAt: null,
            },
            {
                id: expect.any(String),
                mailId: mailSettings.id,
                type: MailParamType.TEXT,
                name: 'registrationLink',
                text: 'http://localhost:3333/dupa',
                createdAt: expect.anything(),
                updatedAt: null,
            },
            {
                id: expect.any(String),
                mailId: mailSettings.id,
                type: MailParamType.TEXT,
                name: 'someImageUrl',
                text: 'https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg',
                createdAt: expect.anything(),
                updatedAt: null,
            },
            {
                id: expect.any(String),
                mailId: mailSettings.id,
                type: MailParamType.EMBEDDED_IMAGE,
                name: 'welcomeImage',
                fileName: 'avatar.png',
                filePath: '/assets/avatar.png',
                createdAt: expect.anything(),
                updatedAt: null,
            },
        ])

        expect(attachments.toArray()).toEqual([
            {
                id: expect.any(String),
                mailId: mailSettings.id,
                fileName: 'external_file.gif',
                filePath: 'https://cdn.pixabay.com/animation/2023/02/16/09/00/09-00-47-382_512.gif',
                name: 'externalFile',
                createdAt: expect.anything(),
                updatedAt: null,
            },
            {
                id: expect.any(String),
                mailId: mailSettings.id,
                fileName: 'avatar.gif',
                filePath: '/resources/avatar.gif',
                name: 'rules',
                createdAt: expect.anything(),
                updatedAt: null,
            },
        ])
    })

    it('should /register not allow to create user with the same email', async () => {
        const response = await ctx.apiClient
            .post('/api/users/register')
            .send({ email: 'JOHN@test.com', password: 'Test123@' } as UserRegister)

        expect(response.statusCode).toBe(HttpStatusCode.PreconditionFailed)
        expect(response.text).toBe('User with this email aready exists')

        const users = await ctx.DB.users.find({ email: 'john@test.com' })
        expect(users.length).toBe(1)
    })

    it('should /register validate registration request', async () => {
        const response = await ctx.apiClient
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
