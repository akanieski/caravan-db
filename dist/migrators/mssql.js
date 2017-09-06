"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("mssql");
class MsSqlMigrator {
    constructor(options) {
        this.options = options;
        this.options.migrationTableName = this.options.migrationTableName || 'MigrationHistory';
        this.options.migrationSchemaName = this.options.migrationSchemaName || 'dbo';
    }
    applyMigration(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    checkSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            let checkSQL = `(SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_SCHEMA = '${this.options.migrationSchemaName}' 
                 AND TABLE_NAME = '${this.options.migrationTableName}')`;
            let result = yield this.pool.request().query(checkSQL);
            return result && result.recordset && result.recordset.length > 0;
        });
    }
    createSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            let createSQL = `
            create table [${this.options.migrationSchemaName}].[${this.options.migrationTableName}] (
                id int identity not null,
                name varchar(255) not null,
                migration_date datetime not null
            )
        `;
            let result = yield this.pool.request().query(createSQL);
            return true;
        });
    }
    connect(connectionString) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pool = new sql.ConnectionPool(connectionString);
            this.pool = yield this.pool.connect();
            return true;
        });
    }
}
exports.MsSqlMigrator = MsSqlMigrator;
//# sourceMappingURL=mssql.js.map