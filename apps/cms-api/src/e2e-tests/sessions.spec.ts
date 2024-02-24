// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthCredentials, UserOut, UserRegister } from '@cms/model'
import { HttpStatusCode } from 'axios'
import request from 'supertest'

describe('/sessions', () => {
    let sessionCookie: string

    it('should /users/register allow to register user', async () => {
        const response = await request(global.app)
            .post('/api/users/register')
            .send({ email: 'test@test.pl', password: 'Test123@' } as UserRegister)

        expect(response.statusCode).toBe(HttpStatusCode.Created)
    })

    it('should not allow to access restricted routes when user not authenticated', async () => {
        const response = await request(global.app).get('/api/users/me')

        expect(response.statusCode).toBe(HttpStatusCode.Forbidden)
        expect(response.text).toBe('Operation not permitted')
    })

    it('should not allow to authenticate not existing user', async () => {
        const response = await request(global.app)
            .post('/api/sessions')
            .send({ email: 'something@test.pl', password: 'Test123@' } as AuthCredentials)

        expect(response.statusCode).toBe(HttpStatusCode.Unauthorized)
        expect(response.text).toBe('Invalid credentials')
    })

    it('should not allow to authenticate using wrong password', async () => {
        const response = await request(global.app)
            .post('/api/sessions')
            .send({ email: 'test@test.pl', password: 'wrong_password' } as AuthCredentials)

        expect(response.statusCode).toBe(HttpStatusCode.Unauthorized)
        expect(response.text).toBe('Invalid credentials')
    })

    it('should allow to authenticate existing user', async () => {
        const response = await request(global.app)
            .post('/api/sessions')
            .send({ email: 'test@test.pl', password: 'Test123@' } as AuthCredentials)

        expect(response.statusCode).toBe(HttpStatusCode.Created)

        const [setCookieHeader] = response.get('Set-Cookie')
        const [cookieValue, cookiePath, expires, httpOnlyFlag] = setCookieHeader.split('; ')

        expect(cookieValue).toContain('SID=')
        expect(cookiePath).toBe('Path=/')
        expect(new Date(expires.split('=')[1]).getTime()).toBeGreaterThan(new Date().getTime())
        expect(httpOnlyFlag).toBe('HttpOnly')

        sessionCookie = setCookieHeader
    })

    it('should allow to access restricted route when authenticated', async () => {
        const response = await request(global.app)
            .get('/api/users/me')
            .set('Cookie', [sessionCookie])

        expect(response.statusCode).toBe(HttpStatusCode.Ok)
        expect(response.body).not.toBeNull()

        const user = response.body as UserOut
        expect(user.id).not.toBeNull()
        expect(user.email).toBe('test@test.pl')
        expect(user.createdAt).not.toBeNull()
    })

    it('should allow to logout user', async () => {
        const response = await request(global.app)
            .delete('/api/sessions')
            .set('Cookie', [sessionCookie])

        expect(response.statusCode).toBe(HttpStatusCode.Ok)

        const [setCookieHeader] = response.get('Set-Cookie')
        const [cookieValue, cookiePath, expires] = setCookieHeader.split('; ')

        expect(cookieValue).toBe('SID=')
        expect(cookiePath).toBe('Path=/')
        expect(new Date(expires.split('=')[1]).getTime()).toBeLessThan(new Date().getTime())
    })

    it('should not allow to access restricted routes after logout', async () => {
        const response = await request(global.app)
            .get('/api/users/me')
            .set('Cookie', [sessionCookie])

        expect(response.statusCode).toBe(HttpStatusCode.Forbidden)
        expect(response.text).toBe('Operation not permitted')
    })
})
