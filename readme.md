# Caravan Db

Caravan helps you automate and apply database migrations in CI/CD environments. Currently supports MSSQL.

## Installation
```npm install -g caravan-db```

## Getting Started
Create a folder and add SQL files that represent each migration. Then you can simply run caravan with the given connection info and it will apply the given migrations, skipping any that have already been applied.

```
caravan -c mssql://localhost/testdb 
```
