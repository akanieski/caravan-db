import * as processArgs from 'command-line-args'
import { IMigrator, IMigratorOptions } from './interfaces'
import { MsSqlMigrator } from './migrators/mssql'


const optionDefinitions = [
    { name: 'connection', alias: 'c', type: String },
    { name: 'schema', alias: 's', type: String},
    { name: 'table', alias: 't', type: String},
    { name: 'debug', alias: 'd', type: Boolean}
]

let args = processArgs(optionDefinitions)
global['debug'] = args.debug

import {DEBUG, INFO, ERROR} from './utils'

if (!args.connection) {
    throw new Error("Connection info is required!")
}

let options: IMigratorOptions = Object.assign({
    migrationTableName: 'migrations',
    migrationSchemaName: 'dbo'
}, args);

(async function() {

    try {
        let migrator: IMigrator
        
        DEBUG('Running caravan with following options:')
        DEBUG(options)    

        switch (args.connection.split('://')[0]) {
            case 'mssql':
            default:
                migrator = new MsSqlMigrator(options)
                INFO('MSSQL migrator initialized')
            break;
        }

        

        await migrator.connect(args.connection)

        INFO('Checking for migration schema ..')
        if (! await migrator.checkSchema()) {
            INFO('Migration schema being created!')
            await migrator.createSchema()
        } else {
            INFO('Migration schema exists!')
        }

        INFO('Running migrations..')
        await migrator.migrate()

    } catch(err) {
        ERROR(err)
        INFO('Migration failed. See error message for more details.')
    }
})().then(() => process.exit()).catch(() => process.exit(1))