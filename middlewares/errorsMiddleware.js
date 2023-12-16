const Err = require("../models/ErrorModel");
const generateRandomString = require("../utilities/randomString");

const errorHandler = async (err, req, res, next) => {
  let errorInDB = new Err({
    name: err.name,
    message: err.message,
    endpoint: req.originalUrl,
    details: err.stack,
    errorId: generateRandomString(6),
  });

  await errorInDB.save();

  let statusCode = 500;
  let message = `Internal server error occured with the following id: ${errorInDB.errorId} , please contact administrator`;
  switch (err.name) {
    case "ValidationError":
      statusCode = 400;
      message = err.message;
      break;
    case "NotFoundError":
      statusCode = 404;
      message = "Not Found";
      break;
    case "UnauthorizedError":
      statusCode = 401;
      message = "Unauthorized";
      break;
  }

  if (err && err.code === 11000) {
    // this give "[keyName] [value] is duplicated"
    let duplicationMessage = `${Object.keys(err.keyValue)[0]} ${
      err.keyValue[Object.keys(err.keyValue)[0]]
    } is duplicated`;
    message = duplicationMessage;
  }

  // return res.status(statusCode).json(message);
  res.render("error", { errorMessage: message });
};

module.exports = errorHandler;
