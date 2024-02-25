import { ColumnLength } from '../core/column-lengths'
import { MigrationFacade } from '../core/migration.facade'

// eslint-disable-next-line camelcase
export class Migration_20240225102356_create_products_table extends MigrationFacade {
    async up(): Promise<void> {
        this.run(
            this.schema.createTable('products', (table) => {
                table.uuid('id').unique().primary()
                table.string('name', ColumnLength.NAME).notNullable()
                table.uuid('created_by').notNullable()
                table.timestamp('created_at').notNullable()
                table.timestamp('updated_at')
            }),
        )
    }

    async down(): Promise<void> {
        this.run(this.schema.dropTable('products'))
    }
}
