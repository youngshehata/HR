const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/hr_db`);
    console.log(`Database connected successfully`);
  } catch (err) {
    console.log(`Error occured while connecting to database ..`);
    console.log(err);
    return;
  }
};

module.exports = connectToDatabase;
