import * as processArgs from 'command-line-args'
import * as getUsage from 'command-line-usage'
import { IMigrator, IMigratorOptions } from './interfaces'
import { MsSqlMigrator } from './migrators/mssql'

const title = ` 
 ,adPPYba, ,adPPYYba, 8b,dPPYba, ,adPPYYba, 8b       d8 ,adPPYYba, 8b,dPPYba,    
a8"     "" ""     'Y8 88P'   "Y8 ""     'Y8 '8b     d8' ""     'Y8 88P'   '"8a   
8b         ,adPPPPP88 88         ,adPPPPP88  '8b   d8'  ,adPPPPP88 88       88   
"8a,   ,aa 88,    ,88 88         88,    ,88   '8b,d8'   88,    ,88 88       88   
 '"Ybbd8"' '"8bbdP"Y8 88         '"8bbdP"Y8     "8"     '"8bbdP"Y8 88       88  
`

const optionDefinitions = [
    { name: 'connection', alias: 'c', type: String, description: 'Database connection string in URI format' },
    { name: 'schema', alias: 's', type: String, description: '[Optional] Database schema for migrations'},
    { name: 'table', alias: 't', type: String, description: '[Optional] Table name for migrations'},
    { name: 'debug', alias: 'd', type: Boolean, description: '[Optional] Debug Mode'},
    { name: 'version', alias: 'v', type: Boolean, description: '[Optional] Version Information'},
    { name: 'help', alias: 'h', type: Boolean, description: 'Help'}
]


let args = processArgs(optionDefinitions)
global['debug'] = args.debug

if (args.version) {
    console.log(title + '\n')
    console.log('Caravan DB v' + require('../package').version)
    process.exit(0)
}
if (args.help) {
    console.log(title)
    console.log(getUsage([
        {
            header: 'Options',
            optionList: optionDefinitions
        }
    ]))
    process.exit(0)
}

console.log(title)

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

        

        await migrator.connect()

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