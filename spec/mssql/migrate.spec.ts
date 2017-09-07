import 'jasmine'
import * as sinon from 'sinon'
import { IMigratorOptions } from '../../lib/interfaces'
import { MsSqlMigrator } from '../../lib/migrators/mssql'

let fs = require('fs-extra'), oldFs = Object.assign({}, require('fs-extra'))

describe ('MSSQL Migrator', async () => {
    
    let migrator = new MsSqlMigrator(<IMigratorOptions> {
        connection: 'mssql://localhost/testdb',
        migrationTableName: 'TestMigrationTable',
        migrationSchemaName: 'TestMigrationSchema',
    })

    let doNothing = () => { }

    it ('should exist', () => expect(migrator).toBeDefined())

    describe ('migrate', () => {

        it ('should check for migrations folder', async (done) => {
            let stub = sinon.stub(fs, 'existsSync')

            stub.callsFake((path) => {
                expect(path).toBeTruthy()
                done()
            })
            
            await migrator.migrate().catch(doNothing)

            stub.restore()
        })

        it ('should get applied migrations', async (done) => {
            let existsStub = sinon.stub(fs, 'existsSync')

            existsStub.returns(true)
            
            let sqlStub = sinon.stub(migrator.pool, 'request').callsFake(() => {
                return {
                    query: (sql) => {
                        expect(sql.toLowerCase()).toContain('testmigrationschema')
                        expect(sql.toLowerCase()).toContain('testmigrationtable')
                        expect(sql.toLowerCase()).toContain('select')
                        done()
                    }
                }
            })
            
            await migrator.migrate().catch(doNothing)
            
            existsStub.restore()
            sqlStub.restore()
        })

    })

})