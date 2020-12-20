const express = require("express");
const router = express.Router();

const isAuthenticated = require("../Middleware/isAuthenticated");

router.get("/profile", isAuthenticated, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
