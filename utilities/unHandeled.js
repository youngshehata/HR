const Err = require("../models/ErrorModel");
const generateRandomString = require("../utilities/randomString");
const unhandeledErrors = async () => {
  // Unhandled & Uncaught
  process.on("uncaughtException", async (err) => {
    await Err.create({
      name: err.name,
      message: err.message,
      endpoint: "unhandled",
      details: err.stack,
      errorId: generateRandomString(6),
    });
    console.log(`UNHANDELED EXCEPTION`);
    console.log(err);
  });
  //--------
  process.on("unhandledRejection", async (err) => {
    await Err.create({
      name: err.name,
      message: err.message,
      endpoint: "unhandled",
      details: err.stack,
      errorId: generateRandomString(6),
    });
    console.log(`UNHANDELED REJECTION`);
    console.log(err);
  });
};

module.exports = unhandeledErrors;
