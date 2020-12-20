module.exports = function (req, res, next) {
  const { market } = req.app.get("config");
  if (!market) return res.status(400).send({ msg: "Market is closed" });
  next();
};
