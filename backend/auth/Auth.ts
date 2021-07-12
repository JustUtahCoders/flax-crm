/*
This is where we will authenticate users.
[x] This should be an HTTP 302 Found response status from the server when the authentication cookie / token is not found server side.
[x] Until we have login working, this should be turned off when the IS_RUNNING_LOCALLY env variable is set.
*/

import { router } from "../Router.js";
import passport from "passport";
import { Strategy } from "passport-custom";
// import cookieSession from "cookie-session"; // maybe get rid of?
import session from "express-session";

// tell passport  how to serialize the user
passport.serializeUser(function (user, done) {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>SERIALIZE USER,", user);
  // @ts-ignore
  done(null, user.id);
});

passport.deserializeUser<User>(function (user, done) {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>DESERIALIZE USER,", user);
  done(null, user);
});

// router.use(
//     cookieSession({
//       name: "session",
//       keys: ["key1", "key2"], //   keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"), from CUI
//       maxAge: 144 * 60 * 60 * 1000, // 144 hours
//       secure: process.env.IS_RUNNING_LOCALLY ? false : true, // in dev env. no need to be secure ??
//     })
// );

// express-session config
const config = {
  name: "session",
  secret: "test secret",
  cookie: {
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.IS_RUNNING_LOCALLY ? false : true, // in dev env. no need to be secure ??
    httpOnly: true, // (if you need to access the cookie from client side code, it should be set to false.  Default is true)

    /* A cookie with the Secure attribute is sent to the server only with an encrypted request over the HTTPS protocol, never with unsecured HTTP (except on localhost), and therefore can't easily be accessed by a man-in-the-middle attacker. NOTE:  Only cont. session id but not entire user object */
  },
  // resave:false,
  // saveUnitialized:false,
  // store: new KnexSessionStore({
  //   knex:require("../database/db-config.js"),
  //   tablename:"sessions",
  //   sidfieldname:"sid",
  //   createTable:true,
  //   clearInterval:1000 * 60 * 60
  // })
};

// in postgres table called "sessions"

router.use(session(config));

// initialize passport
router.use(passport.initialize());
router.use(passport.session()); //  not in CUI

// router.use("/login",  async (req, res, next) => {
//   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LOGIN");

//   res.status(200).send("at login");
// });

router.post(
  "/login",
  function (req, res, next) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BEFORE PASSPORT");
    next();
  },

  passport.authenticate("custom", { successRedirect: "/" }),
  function (req, res) {
    console.log(
      ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AFTER PASSPORT",
      req.session
    ); // it IS defined, it doesn't make it to the router "/"
    // will set session property on req
    // res.status(200).redirect("/");
  }
);

router.get("/login", (req, res) => {
  res.status(200).json("getting login form"); // is not getting executed
});

/*
router.use("/", async (req, res, next) => {

//   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTH REQ,", req.session);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTH REQ,", req.session);
//   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTH REQ,", req.user);

  // if session exists && passort has created a passport object && there is a valid user, proceed. Otherwise, redirect to login.
  if (
    //   req.user || // is never defined
    (req.session)
    //  (req.session && req.session.passport && req.session.passport.user.id) 
    // || process.env.IS_RUNNING_LOCALLY // req.session will be defined because it is local
  ) {
    console.log("successful validation");
    return next();
  } else {
    console.log("redirecting to login");
    res.status(302).redirect("/login");
  }
});
*/

// Configure Strategy for testing:  will approve user.
passport.use(
  new Strategy(
    // { usernameField: "email", passwordField: "password" }, // expects json, we won't be passing in the req body

    function (req, done) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VERIFY");
      // 1) passport collects the user's credentials (username and password)
      // 2) passport then invokes the verify callback, which checks the credentials

      // write a verify callback that checks the credentials and always approves the user
      return done(null, { id: "hello" }); // no error ---> is null, and P2 is the user object

      // EXPECTS A EMAIL & PASSWORD TO BE GIVEN, but we dont give one, so it res with bad request
    }
  )
);

interface User {
  id: string;
}

// why isn't the cookie being set?
// who sets the cookie, express session or passport?
