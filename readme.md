# Caravan DB ![Build & Test Status](https://caravan-db.visualstudio.com/_apis/public/build/definitions/3555b68c-5ff2-4e87-b108-f4356aba4e4a/1/badge)

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
  -f, --migrationsFolder    [Optional] Migrations folder path
  -h, --help                Help

```

## Getting Started
Create a `migrations` folder and add SQL files that represent each migration. Then you can simply run caravan with the given connection info and it will apply the given migrations, skipping any that have already been applied. Migrations will be applied in alphanumeric order based on the file name.

```
$ caravan -c mssql://localhost/testdb



 ,adPPYba, ,adPPYYba, 8b,dPPYba, ,adPPYYba, 8b       d8 ,adPPYYba, 8b,dPPYba,
a8"     "" ""     'Y8 88P'   "Y8 ""     'Y8 '8b     d8' ""     'Y8 88P'   '"8a
8b         ,adPPPPP88 88         ,adPPPPP88  '8b   d8'  ,adPPPPP88 88       88
"8a,   ,aa 88,    ,88 88         88,    ,88   '8b,d8'   88,    ,88 88       88
 '"Ybbd8"' '"8bbdP"Y8 88         '"8bbdP"Y8     "8"     '"8bbdP"Y8 88       88

[INFO] [11:41:31]   MSSQL migrator initialized

[INFO] [11:41:31]   Checking for migration schema ..

[INFO] [11:41:31]   Migration schema exists!

[INFO] [11:41:31]   Running migrations..

[INFO] [11:41:31]       > 001-do_stuff.sql - Already Applied

[INFO] [11:41:31]       > 002-do_more_stuff.sql - Applied!

[INFO] [11:41:31]   Migrations Complete
```

