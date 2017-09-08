import 'jasmine'
import * as sinon from 'sinon'
import { IMigratorOptions } from '../../lib/interfaces'
import { MsSqlMigrator } from '../../lib/migrators/mssql'

let fs = require('fs-extra'), oldFs = Object.assign({}, require('fs-extra'))
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message, error.stack);
});
describe ('MSSQL Migrator', async () => {
    
    let migrator = new MsSqlMigrator(<IMigratorOptions> {
        connection: 'mssql://localhost/testdb',
        migrationTableName: 'TestMigrationTable',
        migrationSchemaName: 'TestMigrationSchema',
        migrationsFolder: './CustomMigrationsPath'
    })

    let doNothing = () => { }

    it ('should exist', () => expect(migrator).toBeDefined())

    describe ('migrate', () => {

        it ('should check for migrations folder', async (done) => {
            let stub = sinon.stub(fs, 'existsSync')

            stub.callsFake((path) => {
                expect(path).toBeTruthy()
                stub.restore()
                done()
            })
            
            await migrator.migrate().catch(doNothing)

          
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
                        existsStub.restore()
                        sqlStub.restore()
                        done()
                    }
                }
            })
            
            await migrator.migrate().catch(doNothing)
            
        })

        it ('should fetch migrations from given migrations folder', async (done) => {
            let existsStub = sinon.stub(fs, 'existsSync')
            let readdirStub = sinon.stub(fs, 'readdir')

            existsStub.returns(true)
            
            let sqlStub = sinon.stub(migrator.pool, 'request').callsFake(() => {
                return {
                    query: (sql) => {
                        // select existing migrations
                        if (sql.toLowerCase().indexOf('testmigrationschema') > -1 &&
                            sql.toLowerCase().indexOf('testmigrationtable') > -1 &&
                            sql.toLowerCase().indexOf('select') > -1) {
                            return Promise.resolve({
                                recordset: [
                                    {
                                        id: 1,
                                        migration_date: new Date(),
                                        name: 'Test Migration'
                                    }
                                ]
                            })
                        }
                    }
                }
            })

            readdirStub.callsFake((path) => {
                expect(path).toEqual('./CustomMigrationsPath')
                existsStub.restore()
                sqlStub.restore()
                readdirStub.restore()
                done()
            })
            
            await migrator.migrate().catch(doNothing)

        })

        it ('should skip already applied migrations', async (done) => {
            let existsStub = sinon.stub(fs, 'existsSync')
            let readdirStub = sinon.stub(fs, 'readdir')
            let readFileStub = sinon.stub(fs, 'readFile')
            let queryCallCount = 0
            let testSQL = 'Test SQL Statement'

            existsStub.returns(true)
            
            let sqlStub = sinon.stub(migrator.pool, 'request').callsFake(() => {
                return {
                    query: (sql) => {
                        queryCallCount = queryCallCount + 1
                        if (queryCallCount === 1) {
                        // select existing migrations
                            return Promise.resolve({
                                recordset: [
                                    {
                                        id: 1,
                                        migration_date: new Date(),
                                        name: 'TestFile1.sql'
                                    }
                                ]
                            })
                        } else if (queryCallCount > 1 && sql.toLowerCase().indexOf('TestFile1.sql') > -1) {
                            fail('Tried to apply migration that was already applied')
                        }
                        // else if (queryCallCount === 2) {
                        //    expect(sql).toEqual(testSQL)
                        // }
                    }
                }
            })

            readdirStub.callsFake((path) => {
                expect(path).toEqual('./CustomMigrationsPath')
                return Promise.resolve(['TestFile1.sql'])
            })

            readFileStub.callsFake((file) => {
                expect(file).toContain('TestFile1.sql')
                return Promise.resolve(testSQL)
            })
            
            await migrator.migrate().catch(doNothing)

            existsStub.restore()
            sqlStub.restore()
            readdirStub.restore()
            readFileStub.restore()
            done()
        })

        it ('should execute unapplied migrations', async (done) => {
            let existsStub = sinon.stub(fs, 'existsSync')
            let readdirStub = sinon.stub(fs, 'readdir')
            let readFileStub = sinon.stub(fs, 'readFile')
            let queryCallCount = 0
            let testSQL = 'Test SQL Statement'
            let migrationInserted = false

            existsStub.returns(true)
            
            let sqlStub = sinon.stub(migrator.pool, 'request').callsFake(() => {
                return {
                    query: (sql) => {
                        queryCallCount = queryCallCount + 1
                        if (queryCallCount === 1) {
                        // select existing migrations
                            return Promise.resolve({
                                recordset: [
                                    
                                ]
                            })
                        } 
                        else if (queryCallCount === 2) {
                           expect(sql).toEqual(testSQL)
                           return Promise.resolve({
                               recordset: []
                           })
                        }
                        else if (queryCallCount === 3) {
                           expect(sql).toContain('insert into')
                           migrationInserted = true
                           return Promise.resolve({
                               recordset: []
                           })
                        }
                    }
                }
            })

            readdirStub.callsFake((path) => {
                expect(path).toEqual('./CustomMigrationsPath')
                return Promise.resolve(['TestFile1.sql'])
            })

            readFileStub.callsFake((file) => {
                console.log('reading file')
                expect(file).toContain('TestFile1.sql')
                return Promise.resolve(testSQL)
            })
            
            await migrator.migrate().catch(doNothing)

            expect(migrationInserted).toBe(true)

            existsStub.restore()
            sqlStub.restore()
            readdirStub.restore()
            readFileStub.restore()
            
            done()
        })

    })

})
