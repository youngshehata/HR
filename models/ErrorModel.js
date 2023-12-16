const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema({
  name: { type: String },
  message: { type: String },
  endpoint: { type: String },
  time: { type: Date, default: Date.now },
  details: { type: String },
  errorId: { type: String, required: true },
});

const Err = mongoose.model("Err", errorSchema);

module.exports = Err;
