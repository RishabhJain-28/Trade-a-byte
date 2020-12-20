const mongoose = require("mongoose");
const { commonDB } = require("../config/db");

const teamSchema = new mongoose.Schema(
  {},
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

teamSchema.index({ event: 1, teamName: 1 }, { unique: true });

const Team = commonDB.model("Team", teamSchema);

module.exports = Team;
