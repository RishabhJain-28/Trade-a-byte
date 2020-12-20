const router = require("express").Router();
const EventTeam = require("../models/EventTeam");
const Question = require("../models/Questions");
const { google } = require("googleapis");

// * Middleware
const authChecker = require("../Middleware/isAuthenticated");
const currentRound = require("../Middleware/currentRound");
const hasTeamID = require("../Middleware/hasTeamID");
const admin = require("../Middleware/admin");
//* Validation
const questionsValidator = require("../utils/validation/Questions");

// * To get Question According to round
router.get("/get", authChecker, hasTeamID, currentRound, async (req, res) => {
  // console.log("cr", req.currentRound);
  if (req.eventTeam[req.currentRound].submitted)
    return res.send({
      submitted: req.eventTeam[req.currentRound].submitted,
      currentRound: req.currentRound,
    });

  if (!req.eventTeam[req.currentRound].updated) {
    const questions = await Question.find({ type: req.currentRound });
    const randIndex = Math.floor(Math.random() * questions.length); //!
    req.eventTeam[req.currentRound].updated = true;
    req.eventTeam[req.currentRound].question = questions[randIndex]._id;
    await req.eventTeam.save();
    res.json({ question: questions[randIndex] });
  } else {
    const question = await Question.findById(
      req.eventTeam[req.currentRound].question
    );
    res.json({
      question,
      currentRound: req.currentRound,
    });
  }
});
//* add a question
router.post("/add", admin, (req, res) => {
  const { value, error } = questionsValidator.add(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  const Ques = new Question({
    ...value,
  });
  Ques.save().then((data) => {
    res.json(data);
  });
});

//*Question Upload
router.post("/upload", authChecker, currentRound, async (req, res) => {
  const eventTeam = await EventTeam.findOne({
    team: req.user.toJSON().teams[0]._id,
  }).populate({
    path: "components",
    populate: {
      path: "comp",
    },
  });

  if (eventTeam[req.currentRound].submitted)
    return res.status(400).send({ msg: "Cannot resubmit a question" });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: req.user.accessToken,
  });

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  if (!req.files.file)
    //! validate=>allow only  text files
    return res.status(400).send({ msg: "No file found" });
  req.body.components = JSON.parse(req.body.components);
  req.body.cart = JSON.parse(req.body.cart);

  const { value, error } = questionsValidator.submitAnswer(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let { name: filename, mimetype, data } = req.files.file;
  if(req.files.file.size > 1000000 ){
    return res.status(400).send({msg : "File tooo large : Max 1 MB"});
  }
  const driveResponse = drive.files.create({
    requestBody: {
      name: `${req.user.toJSON().teams[0].teamName}_${
        req.currentRound
      }_${filename}`,
      mimeType: mimetype,
      parents: ["17tzNE-ke80YTtKvwdkHUH6HT-kvy_QdJ"],
    },
    media: {
      mimeType: mimetype,
      body: Buffer.from(data).toString(),
    },
  });

  driveResponse
    .then(async (data, err) => {
      if (data.status == 200) {
        const curRound = req.currentRound;
        const { cart, components } = value;
        eventTeam[curRound].submitted = true;
        eventTeam[curRound].components = components;
        eventTeam.balance += 2000;

        const returnValue = eventTeam.components.every((c) => {
          if (cart[c.comp._id]) {
            c.qty -= cart[c.comp._id];
            delete cart[c.comp._id];
            if (c.qty < 0) {
              res
                .status(400)
                .send({ msg: "Insufficent items in the inventory" });
              return false;
            }
          }
          return true;
        });

        if (!returnValue) return;
        if (Object.keys(cart).length !== 0)
          return res
            .status(400)
            .send({ msg: "Insufficent items in the inventory" });
        eventTeam.components = eventTeam.components.filter((c) => c.qty > 0);

        await eventTeam.save();

        return res.send({
          components: eventTeam.components,
          submitted: eventTeam[curRound].submitted,
          msg: "file uploaded successfully",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({ msg: "Some error occured while uploading" });
      console.log(err);
    });
});

module.exports = router;
