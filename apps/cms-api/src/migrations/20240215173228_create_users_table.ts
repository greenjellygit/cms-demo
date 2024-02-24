import { ColumnLength } from '../core/column-lengths'
import { MigrationFacade } from '../core/migration.facade'

// eslint-disable-next-line camelcase
export class Migration_20240215173228_create_users_table extends MigrationFacade {
    async up(): Promise<void> {
        this.run(
            this.schema.createTable('users', (table) => {
                table.uuid('id').unique().primary()
                table.string('email', ColumnLength.CODE).unique().notNullable()
                table.string('password', ColumnLength.NAME).notNullable()
                table.timestamp('created_at').notNullable()
                table.timestamp('updated_at')
            }),
        )
    }

    async down(): Promise<void> {
        this.run(this.schema.dropTable('users'))
    }
}
