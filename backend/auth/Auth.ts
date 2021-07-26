/*
This is where we will authenticate users.
[x] All server endpoints starting with /api/ that are not related to auth should respond with http 401 whenever the user is not logged in.
[x] This should be an HTTP 302 Found response status from the server when the authentication cookie / token is not found server side.
[x] Until we have login working, this should be turned off when the IS_RUNNING_LOCALLY env variable is set.
*/

import { router } from "../Router.js";
import passport from "passport";
//import { Strategy } from "passport-custom";
// const CustomStrategy = require("passport-custom").Strategy;
import passportCustom from "passport-custom";
const CustomStrategy = passportCustom.Strategy;
import cookieSession from "cookie-session";
import { renderWebApp } from "../WebApp/RenderWebApp";
import { findOrCreateLocalUser } from "../users/FindOrCreateLocalUser";

const LOCAL_DEV_USER_EMAIL = "localdev@email.com";

// DEFINE PASSPORT STRATEGIES
const passportStrategy = new CustomStrategy(async (req, done) => {
  // LOCAL DEV STRATEGY
  if (process.env.IS_RUNNING_LOCALLY) {
    console.log("localPassportStrategy custom.......................");
    try {
      const localUser = await findOrCreateLocalUser(LOCAL_DEV_USER_EMAIL);
      return done(null, localUser);
    } catch (error) {
      return done(error);
    }
  }
  // MAIN STRATEGY
  console.log("main PassportStrategy.......................");
  return done(null, { id: "hello" });
});

passport.use(passportStrategy);

router.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"], //   keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"), from CUI
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.IS_RUNNING_LOCALLY ? false : true, // in dev env. no need to be secure
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.post(
  "/login",
  (req, res, next) => {
    console.log("POST LOGIN");
    next();
  },
  passport.authenticate("custom", { successRedirect: "/create-noun" })
);

router.get("/login", renderWebApp);

// FOR TESTING ONLY
router.get("/test", async (req, res) => {
  console.log("Doing TEST!!!!!!!!");
  const newUser = await findOrCreateLocalUser("localDev@email.com");
  console.log("After finding or creating local user. Log new user: ", newUser);
  if (newUser) {
    res.status(201).send(newUser);
  } else {
    res.status(500);
  }
});

router.use("/", async (req, res, next) => {
  console.log("router.use(/): ", req.url);

  if (process.env.IS_RUNNING_LOCALLY) {
    console.log("router.use IS RUNNING LOCALLY");
    const localUser = await findOrCreateLocalUser(LOCAL_DEV_USER_EMAIL);
    // passport method .login logs the user in (tells passport the user is authenticated)
    req.login(localUser, function (err) {
      if (err) {
        console.log("In req.login callback ", err);
      }
    });
    return next();
  }

  if (req.session && req.session.passport && req.session.passport.user.id) {
    return next();
  } else if (req.url && req.url.includes("/api")) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    res.status(302).redirect("/login");
  }
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser<User>(function (user, done) {
  done(null, user);
});

interface User {
  id: string;
}
