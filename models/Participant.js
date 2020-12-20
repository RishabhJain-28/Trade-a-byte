const mongoose = require("mongoose");
const { commonDB } = require("../config/db");
const Team = require("./Team");
const participantSchema = new mongoose.Schema(
  {},
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

participantSchema.virtual("teams", {
  ref: Team,
  localField: "_id",
  foreignField: "members",
});

const Participant = commonDB.model("Participant", participantSchema);

module.exports = Participant;
