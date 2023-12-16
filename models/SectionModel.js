const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    minLength: [2, "Section name must be at least 2 characters"],
    maxLength: [50, "Section name maximum length of characters is 50"],
  },
  administrator: {
    type: String,
    required: true,
    minLength: [2, "Section' CEO name must be at least 2 characters"],
    maxLength: [50, "Section' CEO name maximum length of characters is 50"],
  },
});

const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
