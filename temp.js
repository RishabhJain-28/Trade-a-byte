//*Question Upload
router.post("/upload", authChecker, async (req, res) => {
  // config google drive with client token

  const eventTeam = await EventTeam.findOne({
    team: req.user.toJSON().teams[0]._id,
  }).populate({
    path: "components",
    populate: {
      path: "comp",
    },
  });
  //   const eventTeam = data;
  if (eventTeam[process.env.CURRENT_ROUND].submitted)
    return res.status(400).send({ msg: "Cannot resubmit a question" });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: req.user.accessToken,
  });
  // console.log(req.user.accessToken);
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  //move file to google drive
  console.log("file>", req.files.file);

  //!
  const { value, error } = invigilatorValidator.submitAnswer(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  // const eventTeam = await EventTeam.findOne({team:req.user.teams[0]._id}).populate({
  //   path: "components",
  //   populate: {
  //     path: "comp",
  //   },
  // });

  //!
  let { name: filename, mimetype, data } = req.files.file;
  const driveResponse = drive.files.create({
    requestBody: {
      name: `${req.user.toJSON().teams[0].teamName}_${filename}`,
      mimeType: mimetype,
      parents: ["17tzNE-ke80YTtKvwdkHUH6HT-kvy_QdJ"],
      // parents: ["17tzNE-ke80YTtKvwdkHUH6HT-kvy_QdJ"],
    },
    media: {
      mimeType: mimetype,
      body: Buffer.from(data).toString(),
    },
  });

  driveResponse
    .then(async (data, err) => {
      // const msg = "Uploaded Successfully";
      if (data.status == 200) {
        console.log("SUBMITTED");
        const curRound = process.env.CURRENT_ROUND;
        eventTeam[curRound].submitted = true;
        eventTeam[curRound].components = value.components;
        eventTeam.balance += 1000;

        await eventTeam.save();
        return res.send({ msg: "file uploaded successfully" });
      }
    })
    .catch((err) => {
      res.status(400).send({ msg: "Some error occured while uploading" });
      throw new Error(err);
    });
  //         }
  //       ).then((bla) => {
  //         res.redirect(
  //           `${process.env.CLIENT_URL}/dashboard/questions?msg=${msg}`
  //         );
  //       });

  //     if (curRound == "round1") {
  //       EventTeam.update(
  //         { team: req.user.toJSON().teams[0]._id },
  //         {
  //           $set: { "round1.submitted": true },
  //           $inc: { balance: 1000 },
  //         }
  //       ).then((bla) => {
  //         res.redirect(
  //           `${process.env.CLIENT_URL}/dashboard/questions?msg=${msg}`
  //         );
  //       });
  //     } else if (curRound == "round2") {
  //       EventTeam.update(
  //         { team: req.user.toJSON().teams[0]._id },
  //         { $set: { "round2.updated": true }, $inc: { balance: 1000 } }
  //       ).then((bla) => {
  //         res.redirect(
  //           `${process.env.CLIENT_URL}/dashboard/questions?msg=${msg}`
  //         );
  //       });
  //     } else {
  //       EventTeam.update(
  //         { team: req.user.toJSON().teams[0]._id },
  //         { $set: { "round3.updated": true }, $inc: { balance: 1000 } }
  //       ).then((bla) => {
  //         res.redirect(
  //           `${process.env.CLIENT_URL}/dashboard/questions?msg=${msg}`
  //         );
  //       });
  //     }
  //   } // success
  //   else
  //     res.redirect(
  //       `${process.env.CLIENT_URL}/dashboard/questions?err=${err}`
  //     ); // unsuccess
  // })
  // .catch((err) => {
  //   throw new Error(err);
  // });
});
