/*
This is where we will authenticate users.
[x] This should be an HTTP 302 Found response status from the server when the authentication cookie / token is not found server side.
[x] Until we have login working, this should be turned off when the IS_RUNNING_LOCALLY env variable is set.
*/

import { router } from "../Router.js";
import passport from "passport";
import { Strategy } from "passport-custom";
import cookieSession from "cookie-session";
import { renderWebApp } from "../WebApp/RenderWebApp";

router.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"], //   keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"), from CUI
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.IS_RUNNING_LOCALLY ? false : true, // in dev env. no need to be secure
  })
);

router.use(passport.initialize());

router.post(
  "/login",
  (req, res, next) => {
    console.log("POST LOGIN");
    next();
  },
  passport.authenticate("custom", { successRedirect: "/create-noun" })
);

router.get("/login", renderWebApp);

router.use("/", async (req, res, next) => {
  if (req.session && req.session.passport && req.session.passport.user.id) {
    return next();
  } else {
    res.status(302).redirect("/login");
  }
});

passport.use(
  new Strategy(function (req, done) {
    return done(null, { id: "hello" });
  })
);

passport.serializeUser(function (user, done) {
  // @ts-ignore
  done(null, user);
});

passport.deserializeUser<User>(function (user, done) {
  done(null, user);
});

interface User {
  id: string;
}
