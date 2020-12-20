const EventTeam = require("../models/EventTeam");
const isAuthenticated = require("./isAuthenticated");

module.exports = [
  isAuthenticated,
  async (req, res, next) => {
    const eventTeam = await EventTeam.findOne({
      team: req.user.teams[0]._id,
    }).populate({
      path: "components",
      populate: {
        path: "comp",
      },
    });
    // console.log(eventTeam.components);
    req.eventTeam = eventTeam;
    next();
  },
];
