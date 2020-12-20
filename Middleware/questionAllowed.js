module.exports = function (req, res, next) {
  const { question } = req.app.get("config");
  if (!question) return res.status(400).send({ msg: "Question is closed" });
  next();
};
