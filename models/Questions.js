const mongoose = require("mongoose");
const { eventDB } = require("../config/db");

const QuestionSchema = new mongoose.Schema({
  image: {
    type: String,
    default: null,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["round1", "round2", "round3"],
    required: true,
  },
});

const Question = eventDB.model("question", QuestionSchema);

module.exports = Question;
