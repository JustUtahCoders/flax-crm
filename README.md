# Flax CRM

## Running locally

First, install [pnpm](https://pnpm.io/) and [Docker](https://www.docker.com/)

```sh
pnpm install
pnpm run develop
open http://localhost:7600
```

## Visual Studio Code debugging

To debug the NodeJS server in Visual Studio Code, first start up the database and frontend:

```sh
pnpm run dev:vscode
```

Then click on "Run and Debug" in VS Code, and press Start for Develop Backend.

## Connecting to local database

```sh
docker-compose exec db bash
psql flax
# show tables
\dt
select * from "Nouns";
```

## Database migrations

DB migrations are run automatically when you start up the server. To create a new migration, follow the instructions at https://sequelize.org/master/manual/migrations.html. The generated files need to be renamed to have the `.cjs` extension since this project uses ESM by default.
