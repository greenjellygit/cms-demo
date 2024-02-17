import { Migration } from '@mikro-orm/migrations'
import { AbstractSqlDriver, Configuration, Knex } from '@mikro-orm/mysql'

export abstract class MigrationFacade extends Migration {
    protected schema: Knex.SchemaBuilder

    constructor(driver: AbstractSqlDriver, config: Configuration) {
        super(driver, config)
        this.schema = this.getKnex().schema
    }

    protected run(schema: Knex.SchemaBuilder): void {
        schema.toSQL().forEach(({ sql }) => {
            this.addSql(sql)
        })
    }
}
