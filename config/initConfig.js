// * Model
const currentRound = require("../Middleware/currentRound");
const Config = require("../models/Config");

module.exports = async (app) => {
  let config = await Config.findOne();
  if (!config) {
    config = new Config({ currentRound: "round1" });
    await config.save();
  }
  console.log("config", config);
  app.set("config", config);
};
