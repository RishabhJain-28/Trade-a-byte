const router = require("express").Router();
const Components = require("../models/Components");
const EventTeam = require("../models/EventTeam");
const Team = require("../models/Team");

//* Middleware
const hasTeamID = require("../Middleware/hasTeamID");
const admin = require("../Middleware/admin");
const marketAllowed = require("../Middleware/marketAllowed");

//* Validator
const inventoryValidator = require("../utils/validation/Inventory");

//* get all componenets
router.get("/get/components", (req, res) => {
  Components.find({}).then((data) => {
    res.json(data);
  });
});

//* adding componenets to inventory
router.post("/add/components", admin, async (req, res) => {
  const component = new Components({
    ...req.body,
  });
  await component.save();
  res.send(component);
});

//* get inventory of a team
router.get("/team/get/", hasTeamID, async (req, res) => {
  res.send({
    components: req.eventTeam.components,
    balance: req.eventTeam.balance,
  });
});
//* get inventory of a team by ADMIN
router.get("/team/get/:id", admin, async (req, res) => {
  const { id } = req.params;
  const eventTeam = await EventTeam.findOne({ team: id }).populate({
    path: "components",
    populate: {
      path: "comp",
    },
  });
  if (!eventTeam) return res.status(400).send({ msg: "NO INVENTORY FOUND" });
  // console.log("eventTeam", eventTeam);
  res.send(eventTeam);
});

//* buy componenets from inventory for a team
router.post("/buy", marketAllowed, hasTeamID, async (req, res) => {
  const { value: data, error } = inventoryValidator.buyComponents(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  const allComponents = await Components.find()
    .where("_id")
    .in(data.components)
    .exec();
  const ComponentsMap = {};
  allComponents.forEach(
    (component) => (ComponentsMap[component._id] = component)
  );
  let cost = 0;
  data.components.forEach((c) => {
    cost += ComponentsMap[c._id].price * c.qty;
  });
  if (cost > req.eventTeam.balance)
    return res.status(400).send({ msg: "Team has insufficient balance" });
  req.eventTeam.balance -= cost;
  data.components.forEach((c) => {
    const i = req.eventTeam.components.findIndex(
      (ele) => ele.comp._id.toString() === c._id.toString()
    );

    if (i === -1) {
      req.eventTeam.components.push({
        comp: c._id,
        qty: c.qty,
      });
    } else {
      req.eventTeam.components[i].qty += c.qty;
    }
  });

  await req.eventTeam.save();
  res.send({
    msg: "Purchase successful",
    data: {
      components: req.eventTeam.components,
      balance: req.eventTeam.balance,
    },
  });
});

//* change the price of all components by a factor
router.post("/price/change", admin, (req, res) => {
  const { value, error } = inventoryValidator.increasePriceForAll(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  Components.find({}).then((data) => {
    data.forEach(async (rec) => {
      rec.price = rec.price + value.factor;
      await rec.save();
    });
    res.json("Prices changed successfully");
  });
});

//* change the price of one components by a factor
router.post("/price/change/one", admin, (req, res) => {
  const { value, error } = inventoryValidator.increasePriceForOne(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  Components.findById(value.component).then(async (data) => {
    if (!data)
      return res.status(400).send({ msg: "Invalid id of the component" });
    data.price += value.factor;
    await data.save();
    res.json(`Price of ${data.name} changed successfully`);
  });
});

//* increase balance of a team
router.post("/balance", admin, async (req, res) => {
  const { value, error } = inventoryValidator.increaseBalance(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  let team = await Team.findOne({ teamName: value.teamName });
  team = team.toJSON();
  const eventTeam = await EventTeam.findOne({ team: team._id });
  eventTeam.balance += value.increase;
  await eventTeam.save();
  res.send({ teamName: team.teamName, eventTeam });
});

module.exports = router;
