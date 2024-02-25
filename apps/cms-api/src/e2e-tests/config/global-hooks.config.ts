import { AuthCredentials, UserOut, UserRegister } from '@cms/model'
import { AbstractSqlConnection } from '@mikro-orm/sqlite'
import { HttpStatusCode } from 'axios'
import request, { Agent } from 'supertest'

type TestClient = Agent & {
    userId?: string
}

async function truncateSchema() {
    const conn = ctx.DB.em.getConnection() as AbstractSqlConnection
    const knex = conn.getKnex()
    const tables = await knex.raw(
        "SELECT * FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite%';",
    )
    tables.forEach(async ({ name }: { name: string }) => {
        await knex.raw(`delete from '${name}'`)
    })
}

async function getSession() {
    const getCsrfTokenResponse = await request(ctx.app).get('/csrf-token')
    const [setCookieValue] = getCsrfTokenResponse.get('Set-Cookie')
    const [cookieValue] = setCookieValue.split('; ')

    return { sessionCookie: cookieValue, csrfToken: getCsrfTokenResponse.text }
}

async function createAuthorizedApiClient() {
    const { sessionCookie, csrfToken } = await getSession()

    const client: TestClient = request
        .agent(ctx.app)
        .set('Cookie', sessionCookie)
        .set({ 'x-csrf-token': csrfToken })

    const registerResponse = await client
        .post('/api/users/register')
        .send({ email: 'test@cms-demo.io', password: 'Test123@' } as UserRegister)

    expect(registerResponse.statusCode).toBe(HttpStatusCode.Created)

    const loginResponse = await client
        .post('/api/sessions')
        .send({ email: 'test@cms-demo.io', password: 'Test123@' } as AuthCredentials)

    expect(loginResponse.statusCode).toBe(HttpStatusCode.Created)

    const meResponse = await client.get('/api/users/me')

    expect(meResponse.statusCode).toBe(HttpStatusCode.Ok)

    ctx.authorizedApiClient = client
    ctx.authorizedApiClient.userId = (meResponse.body as UserOut).id
}

async function createApiClient() {
    const { sessionCookie, csrfToken } = await getSession()

    ctx.apiClient = request
        .agent(ctx.app)
        .set('Cookie', sessionCookie)
        .set({ 'x-csrf-token': csrfToken })
}

beforeAll(async () => {
    await truncateSchema()
    await createApiClient()
    await createAuthorizedApiClient()
})
