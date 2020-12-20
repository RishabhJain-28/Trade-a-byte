const mongoose = require("mongoose");
const { eventDB } = require("../config/db");
const Schema = mongoose.Schema;

const componentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Components = eventDB.model("Component", componentSchema);

module.exports = Components;
