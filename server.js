const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const path = require("path");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, //24 HOURS
    keys: [process.env.COOKIE_SECRET],
  })
);
app.set("trust proxy", 1); // for heroku

//* init config
require("./config/initConfig")(app);

// * Route imports
const transaction = require("./routes/Transaction");
const auth = require("./routes/Auth");
const participant = require("./routes/Participant");
const inventory = require("./routes/inventory");
const news = require("./routes/news");
// const invigilator = require("./routes/Invigilator");
// const team = require("./routes/Team");
const questions = require("./routes/questions");
const config = require("./routes/Config");

// * Middleware
const questionAllowed = require("./Middleware/questionAllowed");
const tradeAllowed = require("./Middleware/tradeAllowed");
const admin = require("./Middleware/admin");

// * Passport Setup
require("./config/passportParticipant");
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

app.use(express.static(path.resolve(__dirname, "public")));

// * Init DB
require("./config/db");

// * Routes
app.use("/api/transaction", tradeAllowed, transaction);
app.use("/api/auth", auth);
app.use("/api/participant", participant);
app.use("/api/inventory", inventory);
// app.use("/api/team", team);
app.use("/api/news", news);
// app.use("/api/invigilator", invigilator);
app.use("/api/questions", questionAllowed, questions);
app.use("/api/config", admin, config);

// * Server
const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`Server started on port ${port}`));

// * io setup
const io = require("socket.io")(server, { cors: true });
// const { socketIO } = require("io-session-handler");
const session_handler = require("io-session-handler").from(io, {
  timeout: 5000,
});
app.set("session_handler", session_handler);

// Handle unhandled promise exceptions

// * Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "Client", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "Client", "build", "index.html"));
  });
  process.on("uncaughtException", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });
}
