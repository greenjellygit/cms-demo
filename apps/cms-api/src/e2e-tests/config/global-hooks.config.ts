import { AuthCredentials, UserRegister } from '@cms/model'
import { AbstractSqlConnection } from '@mikro-orm/sqlite'
import { HttpStatusCode } from 'axios'
import request from 'supertest'

async function truncateSchema() {
    const conn = DB.em.getConnection() as AbstractSqlConnection
    const knex = conn.getKnex()
    const tables = await knex.raw(
        "SELECT * FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite%';",
    )
    tables.forEach(async ({ name }: { name: string }) => {
        await knex.raw(`delete from '${name}'`)
    })
}

async function getSession() {
    const getCsrfTokenResponse = await request(global.app).get('/csrf-token')
    const [sessionCookieValue] = getCsrfTokenResponse.get('Set-Cookie')

    return { sessionCookie: sessionCookieValue, csrfToken: getCsrfTokenResponse.text }
}

async function createAuthorizedApiClient() {
    const { sessionCookie, csrfToken } = await getSession()

    global.authorizedApiClient = request
        .agent(global.app)
        .set('Cookie', [sessionCookie])
        .set({ 'x-csrf-token': csrfToken })

    const registerResponse = await authorizedApiClient
        .post('/api/users/register')
        .send({ email: 'test@cms-demo.io', password: 'Test123@' } as UserRegister)

    expect(registerResponse.statusCode).toBe(HttpStatusCode.Created)

    const loginResponse = await authorizedApiClient
        .post('/api/sessions')
        .send({ email: 'test@cms-demo.io', password: 'Test123@' } as AuthCredentials)

    expect(loginResponse.statusCode).toBe(HttpStatusCode.Created)
}

async function createApiClient() {
    const { sessionCookie, csrfToken } = await getSession()

    global.apiClient = request
        .agent(global.app)
        .set('Cookie', [sessionCookie])
        .set({ 'x-csrf-token': csrfToken })
}

beforeAll(async () => {
    await truncateSchema()
    await createApiClient()
    await createAuthorizedApiClient()
})
