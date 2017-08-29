import { IMigrator, IMigrationResult, IMigratorOptions } from '../interfaces'
import * as sql from 'mssql'

export class MsSqlMigrator implements IMigrator {

    pool: sql.ConnectionPool;

    constructor(public options: IMigratorOptions) {
        this.options.migrationTableName = this.options.migrationTableName || 'MigrationHistory'
        this.options.migrationSchemaName = this.options.migrationSchemaName || 'dbo'
    }

    async applyMigration(sql: string): Promise<boolean> {
        return true
    }

    async checkSchema(): Promise<boolean> {

        let checkSQL = `(SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_SCHEMA = '${this.options.migrationSchemaName}' 
                 AND TABLE_NAME = '${this.options.migrationTableName}')`

        let result = await this.pool.request().query(checkSQL)

        return result && result.recordset && result.recordset.length > 0
    }    
    
    async createSchema(): Promise<boolean> {

        let createSQL = `
            create table [${this.options.migrationSchemaName}].[${this.options.migrationTableName}] (
                id int identity not null,
                name varchar(255) not null,
                migration_date datetime not null
            )
        `

        let result = await this.pool.request().query(createSQL)

        return true
    }

    async connect(connectionString: string): Promise<boolean> {
        this.pool = new sql.ConnectionPool(connectionString)

        this.pool = await this.pool.connect()

        return true
    }
}