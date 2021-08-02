import Umzug from "umzug";
import s, { Sequelize as SequelizeType } from "sequelize";
import ss from "umzug/lib/storages/SequelizeStorage.js";
import { router } from "./Router.js";
// @ts-ignore
import db from "../models/index.cjs";

const { default: SequelizeStorage } = ss;
const { Sequelize } = s;

export const sequelize: SequelizeType = db.sequelize;

export const dbReady = new Promise<void>((resolve, reject) => {
  const intervalId = setInterval(() => {
    console.log("Attempting to connect to db");
    sequelize
      .authenticate()
      .then(() => {
        console.log("Database connection established");
        clearInterval(intervalId);

        const umzug = new Umzug({
          migrations: {
            path: "migrations",
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
          resolve();
        });
      })
      .catch((err) => {
        console.error("Failed to connect to db. Trying again in 100ms");
        console.error(err);
      });
  }, 100);
});

router.use(async (req, res, next) => {
  await dbReady;
  next();
});
