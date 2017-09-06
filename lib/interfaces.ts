export interface IMigrationResult {
    message: string
    stack: string
    success: boolean
    data: any
}
export class Migration {
    id: number
    migration_date: any
    name: string
}
export interface IMigratorOptions {
    migrationTableName: string
    migrationSchemaName: string
}
export interface IMigrator {
    applyMigration(sql: string): Promise<boolean>

    checkSchema(): Promise<boolean>

    createSchema(): Promise<boolean>

    migrate(): Promise<boolean>
    
    connect(connectionString: string): Promise<boolean>
}