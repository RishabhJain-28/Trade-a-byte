const passport = require("passport");
const googleStrategy = require("passport-google-oauth2").Strategy;
const EventTeam = require("../models/EventTeam");

// * Models
const Participant = require("../models/Participant");

// * Gettingup Passport google strategy
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/login/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      let participant = await Participant.findOne({
        email: profile.email,
      }).populate("teams");
      // console.log(participant);
      if (!participant) {
        return done(null, false, {
          message: "This google ID not registered.",
        });
      }
      const [team] = participant.teams.filter(
        (team) => team.toJSON().event.toString() === process.env.EVENT_ID
      );
      if (!team) {
        return done(null, false, {
          message: "No team for this event found.",
        });
      }
      if (team.toJSON().members.length < 2) {
        return done(null, false, {
          message: "Time should have at least 2 members.",
        });
      }
      const local_team = await EventTeam.findOne({
        team: team._id,
      });
      if (!local_team) {
        const newLocalTeam = new EventTeam({
          team: team._id,
          balance: 10000,
        });
        // console.log("new team ", newLocalTeam);
        await newLocalTeam.save();
      }
      // console.log(accessToken);

      done(null, { id: participant._id, accessToken });
    }
  )
);

// * Passport serializeUser
passport.serializeUser((obj, done) => {
  done(null, obj);
});

// * Passport deserializeUser
passport.deserializeUser(async (obj, done) => {
  const participant = await Participant.findById(obj.id).populate("teams");

  const [team] = participant.teams.filter(
    (team) => team.toJSON().event.toString() === process.env.EVENT_ID
  );
  participant.teams = [team];
  participant.accessToken = obj.accessToken;
  done(null, participant);
});
