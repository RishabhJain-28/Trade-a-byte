module.exports = function (req, res, next) {
  const { trade } = req.app.get("config");
  if (!trade) return res.status(400).send({ msg: "Trade is closed" });
  next();
};
