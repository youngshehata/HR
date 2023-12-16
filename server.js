const express = require("express");
const app = express();
const initMiddleWares = require("./utilities/initMiddlewares");
const connectToDatabase = require("./config/dbConfig");
const seedData = require("./utilities/seedData");
const unhandeledErrors = require("./utilities/unHandeled");
const createFolders = require("./utilities/foldersCreation");

const Initialize = async () => {
  // listen for unhandled errors
  await unhandeledErrors();
  // create necessary folders
  createFolders();
  // Initialize Middlewares
  initMiddleWares(app);
  // Connect to MongoDB
  await connectToDatabase();
  await seedData();
};

Initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is up and listening on port ${PORT}`);
});
