# Flax CRM

## Running locally

First, install [pnpm](https://pnpm.io/) and [Docker](https://www.docker.com/)

```sh
pnpm install
pnpm run develop
open http://localhost:7600
```

## Connecting to local database

```sh
docker-compose exec db bash
psql flax
\dt # show tables
select * from nouns;
```

## Database migrations

DB migrations are run automatically when you start up the server. To create a new migration, follow the instructions at https://sequelize.org/master/manual/migrations.html. The generated files need to be renamed to have the `.cjs` extension since this project uses ESM by default.
