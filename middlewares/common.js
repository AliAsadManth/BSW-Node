//? init
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");

//? Common Middleware
module.exports = (app) => {
  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan("dev"));
};
