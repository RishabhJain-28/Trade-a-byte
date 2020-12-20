const mongoose = require("mongoose");
const { eventDB } = require("../config/db");

const eventTeamSchema = new mongoose.Schema({
  components: [
    {
      comp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Component",
      },
      qty: {
        type: Number,
      },
    },
  ],
  balance: {
    type: Number,
    default: 0,
  },
  round1: {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    components: [
      {
        comp: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Component",
        },
        qty: {
          type: Number,
        },
      },
    ],
    evaluated: { type: Boolean, default: false },
    submitted: {
      type: Boolean,
      default: false,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  round2: {
    question: mongoose.Schema.Types.ObjectId,
    components: [
      {
        comp: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Component",
        },
        qty: {
          type: Number,
        },
      },
    ],
    evaluated: { type: Boolean, default: false },
    submitted: {
      type: Boolean,
      default: false,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  round3: {
    question: mongoose.Schema.Types.ObjectId,
    components: [
      {
        comp: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Component",
        },
        qty: {
          type: Number,
        },
      },
    ],
    evaluated: { type: Boolean, default: false },
    submitted: {
      type: Boolean,
      default: false,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  // evaluated: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
});

const EventTeam = eventDB.model("EventTeam", eventTeamSchema);
module.exports = EventTeam;
