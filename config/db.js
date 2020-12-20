const mongoose = require("mongoose");

const commonDB = mongoose.createConnection(
  process.env.MONGO_URI_COMMON_DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.error("Connection to Common DB failed.");
    return console.log("Connected to Common DB.");
  }
);
const eventDB = mongoose.createConnection(
  process.env.MONGO_URI_EVENT_DB_LOCAL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.error("Connection to Event DB failed.");
    return console.log("Connected to Event DB.");
  }
);

module.exports = {
  commonDB,
  eventDB,
};
