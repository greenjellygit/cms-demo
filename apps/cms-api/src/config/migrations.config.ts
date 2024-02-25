import { UnderscoreNamingStrategy } from '@mikro-orm/core'
import { TSMigrationGenerator } from '@mikro-orm/migrations'

export class CustomNamingStrategy extends UnderscoreNamingStrategy {
    public classToMigrationName(timestamp: string, customMigrationName: string) {
        let migrationName = `Migration_${timestamp}`
        if (customMigrationName) {
            migrationName += `_${customMigrationName}`
        }
        return migrationName
    }
}

export class CustomMigrationGenerator extends TSMigrationGenerator {
    public generateMigrationFile(
        className: string,
        diff: { up: string[]; down: string[] },
    ): string {
        let content = `import { MigrationFacade } from '../core/migration.facade'\n\n`
        content += `// eslint-disable-next-line camelcase\n`
        content += `export class ${className} extends MigrationFacade {\n\n`
        content += `  async up(): Promise<void> {\n`
        diff.up.forEach((sql) => {
            content += this.createStatement(sql, 4)
        })
        content += `  }\n\n`
        if (diff.down.length > 0) {
            content += `  async down(): Promise<void> {\n`
            diff.down.forEach((sql) => {
                content += this.createStatement(sql, 4)
            })
            content += `  }\n\n`
        }
        content += `}\n`
        return content
    }
}

export function createCustomFileName(timestamp: string, name?: string) {
    if (!name) {
        throw new Error('Specify migration name via `mikro-orm migration:create --name=...`')
    }

    return `${timestamp}_${name}`
}
