const mongoose = require("mongoose");
const { eventDB } = require("../config/db");

const transactionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    to: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      name: {
        type: String,
      },
    },
    from: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      name: {
        type: String,
      },
    },
    requestAmount: {
      type: Number,
    },
    offerAmount: {
      type: Number,
    },
    requestComponents: [
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
    offerComponents: [
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
    status: {
      value: {
        type: String,
        default: "STARTED",
      },
      time: {
        type: Date,
      },
    },
    time_offer: {
      type: Date,
    },
  },
  { timestamps: true }
);
// transactionSchema.index(
//   { createdAt: 1 },
//   {
//     // expireAfterSeconds: 30,
//     // partialFilterExpression: { test: false },
//   }
// );

const Transaction = eventDB.model("Transaction", transactionSchema);
Transaction.states = {
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  SENT: "SENT",
  CANCELED: "CANCELED",
};
module.exports = Transaction;
