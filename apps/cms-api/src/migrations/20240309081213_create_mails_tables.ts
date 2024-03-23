import { ColumnLength } from '../core/column-lengths'
import { MigrationFacade } from '../core/migration.facade'

// eslint-disable-next-line camelcase
export class Migration_20240309081213_create_mails_tables extends MigrationFacade {
    async up(): Promise<void> {
        this.run(
            this.schema
                .createTable('mails', (table) => {
                    table.uuid('id').unique().primary()
                    table.string('type', ColumnLength.CODE).notNullable()
                    table.string('subject', ColumnLength.NAME).notNullable()
                    table.string('email_from', ColumnLength.NAME).notNullable()
                    table.string('email_to', ColumnLength.NAME).notNullable()
                    table.integer('attempt_count').notNullable()
                    table.string('status', ColumnLength.CODE).notNullable()
                    table.string('error_message', ColumnLength.DESCRIPTION)
                    table.uuid('created_by')
                    table.timestamp('created_at').notNullable()
                    table.timestamp('updated_at')
                })
                .createTable('mail_params', (table) => {
                    table.uuid('id').unique().primary()
                    table.uuid('mail_id')
                    table.string('name', ColumnLength.NAME).notNullable()
                    table.string('type', ColumnLength.CODE).notNullable()
                    table.string('text', ColumnLength.DESCRIPTION)
                    table.string('file_name', ColumnLength.NAME)
                    table.string('file_path', ColumnLength.NAME)
                    table.timestamp('created_at').notNullable()
                    table.timestamp('updated_at')

                    table.foreign('mail_id').references('id').inTable('mails')
                    table.unique(['mail_id', 'name'])
                })
                .createTable('mail_attachments', (table) => {
                    table.uuid('id').unique().primary()
                    table.uuid('mail_id')
                    table.string('name', ColumnLength.NAME).notNullable()
                    table.string('file_name', ColumnLength.NAME).notNullable()
                    table.string('file_path', ColumnLength.NAME).notNullable()
                    table.timestamp('created_at').notNullable()
                    table.timestamp('updated_at')

                    table.foreign('mail_id').references('id').inTable('mails')
                    table.unique(['mail_id', 'name'])
                }),
        )
    }

    async down(): Promise<void> {
        this.run(
            this.schema.dropTable('mail_attachments').dropTable('mail_params').dropTable('mails'),
        )
    }
}
