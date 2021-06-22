import express from "express";
import { router } from "./Router.js";
import bodyParser from "body-parser";
import "./DB.js";
import "./RouteImports.js";
import kill from "tree-kill";
import open from "open";

const app = express();
app.use(bodyParser.json());
app.use(router);

const port = process.env.PORT || 7600;

app.listen(port);

const fullUrl = `http://localhost:${port}`;
console.log(`Listening on ${fullUrl}`);

// https://github.com/remy/nodemon/issues/1247
const pid = process.pid;
process.on("SIGINT", function () {
  kill(pid, "SIGTERM");
  process.exit();
});

if (process.env.NODE_ENV !== "production" && process.env.FLAX_OPEN === "true") {
  delete process.env.FLAX_OPEN;
  open(fullUrl);
}
