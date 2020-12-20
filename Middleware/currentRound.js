module.exports = (req, res, next) => {
  req.currentRound = req.app.get("config").currentRound;
  next();
};
