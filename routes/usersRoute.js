const express = require("express");
const app = express();
const {
  login,
  createNewUser,
  logout,
  checkForUsername,
  resetPassword,
} = require("../controllers/usersController");

app.post("/register", createNewUser);
app.post("/login", login);
app.get("/logout", logout);
app.post("/check", checkForUsername);
app.post("/reset", resetPassword);

module.exports = app;
