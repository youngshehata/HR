const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  id: { type: Number, min: 1 },
});

const Question = mongoose.model("Question", questionsSchema);

module.exports = Question;
