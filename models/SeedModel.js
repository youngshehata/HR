const mongoose = require("mongoose");

const seedSchema = new mongoose.Schema({}, { strict: false });

const Seed = mongoose.model("Seed", seedSchema);

module.exports = Seed;
