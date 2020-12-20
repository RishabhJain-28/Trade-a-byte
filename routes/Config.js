const router = require("express").Router();

// * Models
const Config = require("../models/Config");

//* Middleware
const admin = require("../Middleware/admin");

//* Validation
const configValidator = require("../utils/validation/Config");

// * API Endpoints -->

// * get current config
router.get("/", async (req, res) => {
  const config = req.app.get("config");
  console.log("c", config);
  res.send(config);
});

// * toggle market
router.get("/market", async (req, res) => {
  const config = await Config.findOne();
  config.market = !config.market;
  await config.save();
  req.app.set("config", config);
  res.send({ msg: `market set to ${config.market}`, data: config });
});

// * toggle trading
router.get("/trading", async (req, res) => {
  const config = await Config.findOne();
  config.trade = !config.trade;
  await config.save();
  req.app.set("config", config);
  res.send({ msg: `trading set to ${config.trade}`, data: config });
});

// * toggle question
router.get("/question", async (req, res) => {
  const config = await Config.findOne();
  config.question = !config.question;
  await config.save();
  req.app.set("config", config);
  res.send({ msg: `question set to ${config.question}`, data: config });
});

// * update round
router.post("/round", async (req, res) => {
  const { value, error } = configValidator.round(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  const config = await Config.findOne();
  config.currentRound = value.currentRound;
  await config.save();
  req.app.set("config", config);
  res.send({ msg: `round set to ${config.currentRound}`, data: config });
});

module.exports = router;
