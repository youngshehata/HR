const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  rootUser: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    minLength: [2, "Name must be at least 2 characters"],
    maxLength: [100, "Name maximum length of characters is 100"],
  },
  section: {
    type: String,
    required: true,
    minLength: [2, "Name must be at least 2 characters"],
    maxLength: [100, "Name maximum length of characters is 100"],
  },
  title: {
    type: String,
    default: "New Employee",
    minLength: [2, "Name must be at least 2 characters"],
    maxLength: [100, "Name maximum length of characters is 100"],
  },
  vacationsLimit: {
    type: Number,
    default: 45,
    min: 30,
    max: 60,
  },
  vacationsUsage: {
    type: Number,
    default: 0,
    min: 0,
    max: 60,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
