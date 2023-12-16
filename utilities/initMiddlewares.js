const express = require("express");
const path = require("path");
const indexRouter = require("../routes/indexRoute");
const usersRoute = require("../routes/usersRoute");
const convertRoute = require("../routes/convertRoute");
const employeesRoute = require("../routes/employeesRoute");
var cookieParser = require("cookie-parser");
const errorsMiddleware = require("../middlewares/errorsMiddleware");
const authMidlleware = require("../middlewares/authMidlleware");

const initMiddleWares = (app) => {
  try {
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname + "../../" + "public/")));
    app.use(cookieParser());
    app.use(express.json());
    app.use("/", indexRouter);
    app.use("/users", usersRoute);
    app.use("/convert", convertRoute);
    app.use("/employees", authMidlleware, employeesRoute);
    // Errors middleware should be last one
    app.use(errorsMiddleware);
  } catch (err) {
    console.log(`Error on init middlewares`);
    console.log(err);
  }
};

module.exports = initMiddleWares;
