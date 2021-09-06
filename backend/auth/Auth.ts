/*
This is where we will authenticate users.
[x] All server endpoints starting with /api/ that are not related to auth should respond with http 401 whenever the user is not logged in.
[x] This should be an HTTP 302 Found response status from the server when the authentication cookie / token is not found server side.
[x] Until we have login working, this should be turned off when the IS_RUNNING_LOCALLY env variable is set.
*/

import { router } from "../Router.js";
import cookieSession from "cookie-session";
import passport from "passport";
import util from "util";
import { Strategy } from "passport-local";
import { renderWebApp } from "../WebApp/RenderWebApp";
import {
  findOrCreateLocalUser,
  findUser,
  findOrCreateGoogleUser,
} from "../users/Users";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

const LOCAL_DEV_USER_EMAIL = "localdev@email.com";

let passportStrategy = new Strategy(async function (email, password, done) {
  try {
    let user = await findUser(email, password);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "437751451243-do7cqgls9rooar4q430cr57nu24cgb5n.apps.googleusercontent.com",
      clientSecret: "zC6Mt0fGV7ObDtPg1rw2CNsN",
      callbackURL: "http://localhost:7600/auth/google/callback", // Change to env variable  .. auth/google/callback
    },
    async function (accessToken, refreshToken, profile, done) {
      const googleUser = await findOrCreateGoogleUser(profile);
      return done(null, googleUser); // null instead of error for now? add error handling here
    }
  )
);

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

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  res.status(200).json({ loginSuccess: true });
});

router.get("/login", renderWebApp);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.use("/", async (req, res, next) => {
  if (req.session && req.session.passport && req.session.passport.user.id) {
    return next();
  } else if (process.env.IS_RUNNING_LOCALLY) {
    const localUser = await findOrCreateLocalUser(LOCAL_DEV_USER_EMAIL);
    try {
      const login = util.promisify(req.login).bind(req);
      await login(localUser);
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error during login");
    }
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
