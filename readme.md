# Caravan DB
------------------
Caravan helps you automate and apply database migrations in CI/CD environments. Currently supports MSSQL.

## Installation
```npm install -g caravan-db```

## Options
```
 ,adPPYba, ,adPPYYba, 8b,dPPYba, ,adPPYYba, 8b       d8 ,adPPYYba, 8b,dPPYba,
a8"     "" ""     'Y8 88P'   "Y8 ""     'Y8 '8b     d8' ""     'Y8 88P'   '"8a
8b         ,adPPPPP88 88         ,adPPPPP88  '8b   d8'  ,adPPPPP88 88       88
"8a,   ,aa 88,    ,88 88         88,    ,88   '8b,d8'   88,    ,88 88       88
 '"Ybbd8"' '"8bbdP"Y8 88         '"8bbdP"Y8     "8"     '"8bbdP"Y8 88       88


Options

  -c, --connection string   Database connection string in URI format
  -s, --schema string       [Optional] Database schema for migrations
  -t, --table string        [Optional] Table name for migrations
  -d, --debug               [Optional] Debug Mode
  -v, --version             [Optional] Version Information
  -h, --help                Help

```

## Getting Started
Create a folder and add SQL files that represent each migration. Then you can simply run caravan with the given connection info and it will apply the given migrations, skipping any that have already been applied.

```
caravan -c mssql://localhost/testdb 
```
