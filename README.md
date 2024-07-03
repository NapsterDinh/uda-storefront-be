# Uda-tsu-storefront

Build a JavaScript API based on a requirements given by the stakeholders. You will architect the database, tables, and columns to fulfill the requirements.

The database schema and and API route information can be found in the (REQUIREMENT.md)

## Installation Instructions:

This section contains all the packages used in this project and how to install them. However, you can fork this repo and run the following command at the root directory to install all packages.

`yarn` or `npm i`

## Set up

### Set up database

`docker-compose up -d` to start the docker container in background
`npm i` to install all dependencies
`db-migrate up` to set up the database and get access via http://localhost:5432
`npm run build` to build the app

### Migrate Database

Navigate to the root directory and run the command below to migrate the database

`npm run migrate-up`

### Environmental Variables Set up

Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development, but you can change it to what works for you.

```bash
PORT=5432
POSTGRES_HOST="localhost"
POSTGRES_USER="###"
POSTGRES_PASSWORD="###"
POSTGRES_DB="store_front_pg_data"
POSTGRES_TEST_DB="postgres"
TOKEN_KEY=###
ENV=test
BCRYPT_PASSWORD=###
SALT_ROUNDS="10"
```

## Start App

- `npm run build` build the application
- `npm run start` to start the app and get access via http://localhost:3000

### Running Ports

After start up, the server will start on port `3000` and the database on port `5432`

## Endpoint Access

All endpoints are described in the [REQUIREMENT.md](REQUIREMENTS.md) file.

## Token and Authentication

Tokens are passed along with the http header as

```
Authorization   Bearer <token>
```

## Testing

Run test with

`npm run test`
