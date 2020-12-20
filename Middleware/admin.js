module.exports = (req, res, next) => {
  const password = req.header("x-auth-admin");
  if (password !== process.env.PASSWORD)
    return res.status(400).send("Cant access admin route");

  next();
};
