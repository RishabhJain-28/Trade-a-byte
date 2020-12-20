const express = require("express");
const router = express.Router();
const News = require("../models/News");

const newsValidator = require("../utils/validation/News");
const admin = require("../Middleware/admin");

router.post("/add", admin, (req, res) => {
  const { value, error } = newsValidator.add(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  const news = new News({
    ...value,
  });
  news.save().then((data) => {
    const session_handler = req.app.get("session_handler");
    session_handler.broadcastMessage({ data, type: 20 });
    // console.log("a");
    res.json({
      msg: "news flashed",
      data,
    });
  });
});

router.get("/get", (req, res) => {
  News.find()
    .sort({ date: -1 })
    .then((data) => {
      // console.log(data);
      res.json(data);
    });
});

module.exports = router;
