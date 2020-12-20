const router = require("express").Router();
const Components = require("../models/Components");
const EventTeam = require("../models/EventTeam");

//* Middleware
const admin = require("../Middleware/admin");

//* Validator
const invigilatorValidator = require("../utils/validation/Submit");

//* mark correct
const submit = async (req, res) => {
  const { value: data, error } = invigilatorValidator.correctAnswer(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const eventTeam = await EventTeam.findById(data.eventTeamId).populate({
    path: "components",
    populate: {
      path: "comp",
    },
  });
  if (eventTeam.evaluated) {
    res.status(400).send({ msg: "Team already evaluated" });
    return false;
  }
  console.log(data.components);
  let shouldReturn = false;
  eventTeam.components.every((c) => {
    // console.log(c.comp._id);
    console.log(c);
    const qty = data.components[c.comp._id];
    console.log(qty);
    if (qty) {
      c.qty -= qty;
      if (c.qty < 0) {
        res.status(400).send({ msg: "Not sufficient inventory" });
        shouldReturn = true;
        return false;
      }
    }

    return true;
  });
  if (shouldReturn) return;

  eventTeam.components = eventTeam.components.filter((c) => c.qty > 0);
  eventTeam.evaluated = true;
  eventTeam.score += 100;
  await eventTeam.save();
  res.send({ eventTeam, msg: "Ans marked correct" });
};

//* mark incorrect
router.get("/reject/:id", admin, async (req, res) => {
  const { id } = req.params;
  const { value: data, error } = invigilatorValidator.validateId(id);
  console.log(data);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  //   const eventTeam = await EventTeam.findById(data.id).populate({
  //     path: "components",
  //     populate: {
  //       path: "comp",
  //     },
  //   });
  //   if (eventTeam.evaluated)
  //     return res.status(400).send({ msg: "Team already evaluated" });

  //   console.log(data.components);
  //   let shouldReturn = false;
  //   eventTeam.components.every((c) => {
  //     // console.log(c.comp._id);
  //     console.log(c);
  //     const qty = data.components[c.comp._id];
  //     console.log(qty);
  //     if (qty) {
  //       c.qty -= qty;
  //       if (c.qty < 0) {
  //         res.status(400).send({ msg: "Not sufficient inventory" });
  //         shouldReturn = true;
  //         return false;
  //       }
  //     }

  //     return true;
  //   });
  //   if (shouldReturn) return;

  //   eventTeam.components = eventTeam.components.filter((c) => c.qty > 0);
  //   eventTeam.evaluated = true;
  //   eventTeam.score += 100;
  //   await eventTeam.save();
  res.send({ eventTeam, msg: "Ans marked incorrect" });
});

module.exports = router;
