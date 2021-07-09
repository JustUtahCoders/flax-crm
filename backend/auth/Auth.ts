/*
This is where we will authenticate users.
[x] This should be an HTTP 302 Found response status from the server when the authentication cookie / token is not found server side.
[x] Until we have login working, this should be turned off when the IS_RUNNING_LOCALLY env variable is set.
*/

import { router } from "../Router.js";

router.use("/login", async (req, res, next) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> LOGIN");
  res.status(200).send("at login");
});

router.use("/", async (req, res, next) => {
  // create a session and cookie for testing purposes
  if (!req.session) {
    req.session = {};
    // generate a unique id for this session
    req.session.id = Math.random().toString(36).substring(7);
  }
  // create session cookie
  res.cookie("session", req.session);

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AUTH REQ,", req.session);

  // if session exists && passort has created a passport object && there is a valid user, proceed. Otherwise, redirect to login.
  if (
    (req.session && req.session.passport && req.session.passport.user.id) ||
    process.env.IS_RUNNING_LOCALLY
  ) {
    console.log("successful validation");
    return next();
  } else {
    console.log("redirecting to login");
    res.status(302).redirect("/login");
  }
});
