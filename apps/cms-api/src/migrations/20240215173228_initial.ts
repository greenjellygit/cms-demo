import { MigrationFacade } from '../core/migration.facade'

// eslint-disable-next-line camelcase
export class Migration_20240215173228_initial extends MigrationFacade {
    async up(): Promise<void> {
        this.run(
            this.schema.createTable('users', (table) => {
                table.increments('id').primary()
                table.string('login').unique().notNullable()
                table.timestamp('created_at').notNullable()
                table.timestamp('updated_at')
            }),
        )
    }

    async down(): Promise<void> {
        this.run(this.schema.dropTable('users'))
    }
}
