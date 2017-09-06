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

        DEBUG('Running caravan with following options:')
        DEBUG(options)    

        switch (args.connection.split('://')[0]) {
            case 'mssql':
                let migrator: IMigrator = new MsSqlMigrator(options)
                INFO('MSSQL migrator initialized')

                await migrator.connect(args.connection)

            break;
        }

    } catch(err) {
        ERROR(err)
        INFO('Migration failed. See error message for more details.')
    }
})()