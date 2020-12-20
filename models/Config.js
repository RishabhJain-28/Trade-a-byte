const mongoose = require("mongoose");
const { eventDB } = require("../config/db");

const configSchema = new mongoose.Schema({
  currentRound: {
    type: String,
    required: true,
    enum: ["round1", "round2", "round3"],
  },
  market: { type: Boolean, default: true },
  trade: { type: Boolean, default: true },
  question: { type: Boolean, default: true },
});

const Config = eventDB.model("Config", configSchema);

module.exports = Config;
