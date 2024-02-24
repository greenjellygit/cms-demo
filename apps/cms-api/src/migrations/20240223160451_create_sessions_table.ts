import { ColumnLength } from '../core/column-lengths'
import { MigrationFacade } from '../core/migration.facade'

// eslint-disable-next-line camelcase
export class Migration_20240223160451_create_sessions_table extends MigrationFacade {
    async up(): Promise<void> {
        this.run(
            this.schema.createTable('sessions', (table) => {
                table.string('sid', ColumnLength.NAME).primary().notNullable()
                table.json('sess').notNullable()
                table.datetime('expired').index('sessions_expired_index').notNullable()
            }),
        )
    }

    async down(): Promise<void> {
        this.run(this.schema.dropTableIfExists('sessions'))
    }
}
