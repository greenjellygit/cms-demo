import { AbstractSqlConnection } from '@mikro-orm/sqlite'

beforeAll(async () => {
    const conn = DB.em.getConnection() as AbstractSqlConnection
    const knex = conn.getKnex()
    const tables = await knex.raw(
        "SELECT * FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite%';",
    )
    tables.forEach(async ({ name }: { name: string }) => {
        await knex.raw(`delete from '${name}'`)
    })
})
