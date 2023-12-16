const express = require("express");
const app = express();
const uploadFile = require("express-fileupload");
const {
  seedMongoDB,
  convertToJSON,
} = require("../controllers/convertController");

app.post(
  "/seed",
  uploadFile({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
  seedMongoDB
);

app.post(
  "/json",
  uploadFile({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
  convertToJSON
);

module.exports = app;
