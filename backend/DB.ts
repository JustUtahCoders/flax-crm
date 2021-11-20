import Umzug from "umzug";
import ss from "umzug/lib/storages/SequelizeStorage.js";
import { router } from "./Router.js";
import { Sequelize } from "sequelize";
import dbConfigs from "./DB/config/config";
import EventEmitter from "events";

const env: string = process.env.NODE_ENV || "development";
const config = dbConfigs[env];

const { default: SequelizeStorage } = ss;

if (!config) {
  throw Error(`No db config found for NODE_ENV '${env}'`);
}

if (!config.database) {
  throw Error(
    `Invalid db config - no database set. This usually means an environment variable is not set.`
  );
}
if (!config.username) {
  throw Error(
    `Invalid db config - no username set. This usually means an environment variable is not set.`
  );
}
if (!config.password) {
  throw Error(
    `Invalid db config - no password set. This usually means an environment variable is not set.`
  );
}

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export const modelEvents = new EventEmitter();

export const dbReady = Promise.resolve().then(() => {
  // Tell all models to init and associate with other models. This can't be done synchronously
  // in the model files because of order-of-execution edge cases.
  // See https://sequelize.org/master/class/lib/associations/base.js~Association.html
  modelEvents.emit("init", sequelize);

  return new Promise<void>((resolve, reject) => {
    let timeoutId;
    const intervalId = setInterval(() => {
      console.log("Attempting to connect to db");
      sequelize
        .authenticate()
        .then(() => {
          console.log("Database connection established");
          clearInterval(intervalId);

          const umzug = new Umzug({
            migrations: {
              path: "./backend/DB/migrations",
              pattern: /\.cjs$/,
              params: [sequelize.getQueryInterface(), Sequelize],
            },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({
              sequelize,
            }),
            logger: console,
          });

          console.log("Running database migrations");
          return umzug.up().then(() => {
            console.log("Finished database migrations");
            clearTimeout(timeoutId);
            resolve();
          });
        })
        .catch((err) => {
          console.error("Failed to connect to db. Trying again in 300ms");
          // console.error(err);
        });
    }, 300);

    if (env !== "development") {
      timeoutId = setTimeout(() => {
        console.log("Unable to connect to db. Giving up");
        process.exit(1);
      }, 10000);
    }
  });
});

router.use(async (req, res, next) => {
  await dbReady;
  next();
});
