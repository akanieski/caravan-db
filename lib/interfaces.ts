export interface IMigrationResult {
    message: string
    stack: string
    success: boolean
    data: any
}
export interface IMigratorOptions {
    migrationTableName: string
    migrationSchemaName: string
}
export interface IMigrator {
    applyMigration(sql: string): Promise<boolean>

    checkSchema(): Promise<boolean>

    createSchema(): Promise<boolean>
    
    connect(connectionString: string): Promise<boolean>
}