# Uda-tsu-storefront

Build a JavaScript API based on a requirements given by the stakeholders. You will architect the database, tables, and columns to fulfill the requirements.

The database schema and and API route information can be found in the (REQUIREMENT.md)

## Installation Instructions:

This section contains all the packages used in this project and how to install them. However, you can fork this repo and run the following command at the root directory to install all packages.

`yarn` or `npm i`

### Environmental Variables Set up

Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development, but you can change it to what works for you.

```bash
PORT=3000
POSTGRES_PORT=5432
POSTGRES_HOST="localhost"
POSTGRES_USER="admin"
POSTGRES_PASSWORD="123456"
POSTGRES_DB="storefront_dev"
TOKEN_KEY=token
ENV=dev
SALT_ROUNDS="10"
```


## Set up

### Set up database
1. Make sure you already install `Docker` on your local machine

2. `docker-compose up -d` to start the docker container in background

3. `docker container list` to view all container which running on you local machine. Pick `container_id` of `uda-storefront-be-storefront_dev-1`
4. `docker exec -it uda-storefront-be-storefront_dev-1 psql -U admin` to open `psql` cli

5. Run this command to create database for dev environment
```bash 
create database storefront_dev;
\l     #to view list database
\q     #to quit psql
```

6. Repeat step 3-5 to create database for `test` environment. Change database name in command from `storefront_dev` to `storefront_test`

7. `npm i` to install all dependencies

8. `npm run migrate-up` to set up the database and get access via http://localhost:5432

9. `npm run build` to build the app

10. For processing to database, run this command:
```bash
docker exec -it uda-storefront-be-storefront_dev-1 psql -U admin storefront_dev
```

### Migrate Database

- Navigate to the root directory and run the command below to migrate the database

```bash 
npm run migrate-up
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
