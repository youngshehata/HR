const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      unique: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [100, "Name maximum length of characters is 100"],
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      maxLength: [100, "Name maximum length of characters is 100"],
      // gonna be encrypted so no need for minlength, anyway the encrypted pw will be long
    },
    secretQuestion: {
      type: String,
      required: [true, "A secret question must be provided"],
      minLength: 2,
      maxLength: 500,
    },
    secretAnswer: {
      type: String,
      required: [true, "A secret answer must be provided"],
      minLength: [1, "Secret answer cannot be empty"],
      maxLength: 500,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
