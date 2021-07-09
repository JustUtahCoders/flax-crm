import express from "express";
import { router } from "./Router.js";
import bodyParser from "body-parser";
import "./DB.js";
import "./RouteImports.js";
import kill from "tree-kill";
import open from "open";
import cookieSession from "cookie-session";
import passport from "passport";

const app = express();
app.use(bodyParser.json());
app.use(router);

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"], //   keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"), from CUI
    maxAge: 144 * 60 * 60 * 1000, // 144 hours --->  What maxAge should we use?
    secure: process.env.IS_RUNNING_LOCALLY ? false : true, // in dev env. no need to be secure
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

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
