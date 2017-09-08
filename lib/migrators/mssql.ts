import { IMigrator, IMigrationResult, IMigratorOptions, Migration } from '../interfaces'
import * as sql from 'mssql'
import * as fs from 'fs-extra'
import {INFO, DEBUG, ERROR} from '../utils'
import * as path from 'path'

export class MsSqlMigrator implements IMigrator {

    pool: sql.ConnectionPool;


    constructor(public options: IMigratorOptions) {
        this.pool = new sql.ConnectionPool(options.connection)
        this.options.migrationTableName = this.options.migrationTableName || 'MigrationHistory'
        this.options.migrationSchemaName = this.options.migrationSchemaName || 'dbo'
    }

    async migrate(): Promise<boolean> {
        if (!fs.existsSync(this.options.migrationsFolder)) {
            throw new Error('Migrations folder not found!')
        }

        let appliedMigrationsSql = `select * from [${this.options.migrationSchemaName}].[${this.options.migrationTableName}]`
        let appliedMigrations = await this.pool.request().query<Migration>(appliedMigrationsSql)
        let migrationFiles = await fs.readdir(this.options.migrationsFolder)

        for (let file of migrationFiles) {
            let state = 'Already Applied'

            if (appliedMigrations.recordset.filter(m => m.name.toLowerCase() === file.toLowerCase()).length === 0) {
                // TODO: Transaction protect this!
                await this.pool.request().query((await fs.readFile(path.join('./migrations',file))).toString())
                await this.pool.request().query(`insert into [${this.options.migrationSchemaName}].[${this.options.migrationTableName}] (name, migration_date) values ('${file}', getdate())`)
                state = 'Applied'
            }

            INFO(`\t> ${file} - ${state}`)
        }

        INFO(`Migrations Complete`)
        return true;
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

    async connect(): Promise<boolean> {

        this.pool = await this.pool.connect()

        return true
    }
}