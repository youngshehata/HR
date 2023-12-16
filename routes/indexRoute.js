const express = require("express");
const app = express();
const Question = require("../models/SecretQuestionsModel");
const authenticate = require("../middlewares/authMidlleware");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/isLogged", authenticate, (req, res) => {
  res.status(200).json("Logged");
});

app.get("/forgotpassword", (req, res) => {
  res.render("forgotPassword");
});

app.get("/convert", (req, res) => {
  res.render("convert");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", async (req, res) => {
  const questions = await Question.find({});
  res.render("register", { questions });
});

module.exports = app;
