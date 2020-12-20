const router = require("express").Router();
const UIDGenerator = require("uid-generator");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 minutes
  max: 20,
  handler: function (req, res) {
    // console.log(req.rateLimit);
    res
      .status(429)
      .send({ msg: "Rate limit reached", resetTime: req.rateLimit.resetTime });
  },
});

// * Models
const Transaction = require("../models/Transaction");
const EventTeam = require("../models/EventTeam");

//* validation
const transactionValidator = require("../utils/validation/Transaction");

//* Middleware
const hasTeamID = require("../Middleware/hasTeamID");
const admin = require("../Middleware/admin");

// * API Endpoints -->

// * get all transactions
router.get("/admin/all", admin, async (req, res) => {
  const transactions = await Transaction.find();
  res.send(transactions);
});

// * get all transactions for a team
router.get("/team/all", hasTeamID, async (req, res) => {
  const transactions = await Transaction.find({
    $or: [
      { "to.id": req.user.teams[0]._id.toString().trim() },
      { "from.id": req.user.teams[0]._id.toString().trim() },
    ],
  })
    .populate({
      path: "requestComponents",
      populate: {
        path: "comp",
      },
    })
    .populate({
      path: "offerComponents",
      populate: {
        path: "comp",
      },
    });

  res.send(transactions);
});

// // * get a transaction
// router.get("/team/:transaction_id", async (req, res) => {
//   const { transaction_id } = req.params;
//   const transactions = await Transaction.findById(transaction_id);
//   res.send(transactions);
// });

//* Initiate a transaction(create code)
router.get("/start", limiter, hasTeamID, async (req, res) => {
  const uidgen = new UIDGenerator(40, UIDGenerator.BASE62);
  const gencode = await uidgen.generate();

  const transaction = new Transaction({
    code: gencode,
    to: {
      id: req.user.teams[0]._id,
      name: req.user.teams[0].toJSON().teamName,
    },
  });
  await transaction.save();
  res.send({ code: gencode });
});
//! expire codes?

// * Send a offer
router.post("/offer", hasTeamID, async (req, res) => {
  const { value, error } = transactionValidator.offer(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  const {
    code,
    requestComponents,
    offerComponents,
    requestAmount,
    offerAmount,
  } = value;
  const reqArray = Object.keys(requestComponents).map((c) => {
    return { comp: c, qty: requestComponents[c] };
  });
  const offerArray = Object.keys(offerComponents).map((c) => {
    return { comp: c, qty: offerComponents[c] };
  });
  const transaction = await Transaction.findOneAndUpdate(
    { code: code },
    {
      code: "-",
      from: {
        id: req.user.teams[0]._id,
        name: req.user.teams[0].toJSON().teamName,
      },
      requestComponents: reqArray,
      offerComponents: offerArray,
      requestAmount,
      offerAmount,
      time_offer: Date.now(),
      status: {
        value: Transaction.states.SENT,
        time: Date.now(),
      },
    },
    { new: true }
  )
    .populate({
      path: "requestComponents",
      populate: {
        path: "comp",
      },
    })
    .populate({
      path: "offerComponents",
      populate: {
        path: "comp",
      },
    });

  if (!transaction) return res.status(400).send({ msg: "INVALID CODE" });
  if (
    transaction.to.id.toString().trim() ===
    req.user.teams[0]._id.toString().trim()
  )
    return res.status(400).send({ msg: "Cant send offer to self" });
  const session_handler = req.app.get("session_handler");
  session_handler.pushMessage(transaction.to.id.toString().trim(), {
    type: 1,
    data: transaction,
  });
  res.send(transaction);
});

// * Accept transaction
router.get("/accept/:transaction_id", hasTeamID, async (req, res) => {
  const { transaction_id } = req.params;
  if (!transaction_id)
    return res.status(400).send({ msg: "INVALID TRANSACTION ID" });

  const transaction = await Transaction.findById(transaction_id)
    .populate({
      path: "requestComponents",
      populate: {
        path: "comp",
      },
    })
    .populate({
      path: "offerComponents",
      populate: {
        path: "comp",
      },
    });

  if (!transaction)
    return res.status(400).send({ msg: "No transaction found" });

  if (
    transaction.to.id.toString().trim() !==
    req.user.teams[0]._id.toString().trim()
  )
    return res.status(403).send({ msg: "Cant accept the offer" });
  if (transaction.status.value !== Transaction.states.SENT)
    return res
      .status(400)
      .send({ msg: "Cannot accept a finished transaction" });
  const sender = await EventTeam.findOne({
    team: transaction.from.id,
  }).populate({
    path: "components",
    populate: {
      path: "comp",
    },
  });
  let shouldReturn = false;
  // console.log();
  // console.log("rc");
  transaction.requestComponents.every((rc) => {
    let i = req.eventTeam.components.findIndex((c) => {
      // console.log("c.comp", c.comp);

      return c.comp._id.toString().trim() === rc.comp._id.toString().trim();
    });
    if (i === -1) {
      // console.log("ret due to -1 n first rc");
      shouldReturn = true;
      // break;
      res.status(400).send({ msg: "Insufficient items in the inventory" });
      return false;
    }
    // console.log("first", i);
    req.eventTeam.components[i].qty -= rc.qty;
    if (req.eventTeam.components[i].qty < 0) {
      shouldReturn = true;
      // break;
      res.status(400).send({ msg: "Insufficient items in the inventory" });
      return false;
    }
    i = sender.components.findIndex((c) => {
      // console.log("c.comp", c.comp);
      // console.log("rc.comp", rc.comp);
      return c.comp._id.toString().trim() === rc.comp._id.toString().trim();
    });

    // console.log("second", i);
    if (i === -1) {
      sender.components.push({
        comp: rc.comp._id,
        qty: rc.qty,
      });
    } else sender.components[i].qty += rc.qty;
    return true;
  });
  if (shouldReturn) return;
  // console.log("oc");
  // console.l
  transaction.offerComponents.every((oc) => {
    let i = sender.components.findIndex((c) => {
      // console.log("c.comp", c.comp);

      return c.comp._id.toString().trim() === oc.comp._id.toString().trim();
    });
    if (i === -1) {
      // console.log("ret due to -1 n first oc");
      shouldReturn = true;
      // break;
      res
        .status(400)
        .send({ msg: "Insufficient items in the senders inventory" });
      return false;
    }
    // console.log("first", i);
    sender.components[i].qty -= oc.qty;
    if (sender.components[i].qty < 0) {
      shouldReturn = true;
      // break;
      res
        .status(400)
        .send({ msg: "Insufficient items in the senders inventory" });
      return false;
    }
    i = req.eventTeam.components.findIndex((c) => {
      // console.log("c.comp", c.comp);
      // console.log("oc.comp", oc.comp);
      return c.comp._id.toString().trim() === oc.comp._id.toString().trim();
    });

    // console.log("second", i);
    if (i === -1) {
      req.eventTeam.components.push({
        comp: oc.comp._id,
        qty: oc.qty,
      });
    } else req.eventTeam.components[i].qty += oc.qty;
    return true;
  });

  if (shouldReturn) {
    // console.lgo("should return ");
    return;
  }

  sender.balance += transaction.requestAmount;
  // console.log()
  req.eventTeam.balance -= transaction.requestAmount;

  sender.balance -= transaction.offerAmount;
  req.eventTeam.balance += transaction.offerAmount;
  if (sender.balance < 0)
    return res
      .status(400)
      .send({ msg: "The other team doesnt have enough balance" });
  if (req.eventTeam.balance < 0)
    return res
      .status(400)
      .send({ msg: "Your team doesnt have enough balance" });
  req.eventTeam.components = req.eventTeam.components.filter(
    (c) => c.qty !== 0
  );
  sender.components = sender.components.filter((c) => c.qty !== 0);
  transaction.status = {
    value: Transaction.states.ACCEPTED,
    time: Date.now(),
  };
  await Promise.all([transaction.save(), sender.save(), req.eventTeam.save()]);
  // await transaction.save(); //! promise all

  // console.log("accepted ", transaction);
  // console.log("accepted ");
  // send socket brodcast

  const session_handler = req.app.get("session_handler");
  session_handler.pushMessage(transaction.from.id.toString().trim(), {
    type: 2,
    status: Transaction.states.ACCEPTED,
    // data: { msg: "transaction was accepted " },
    data: transaction,
  });
  res.send(transaction);
});

// * Reject transaction

router.get("/reject/:transaction_id", hasTeamID, async (req, res) => {
  const { transaction_id } = req.params;
  if (!transaction_id)
    return res.status(400).send({ msg: "INVALID TRANSACTION ID" });

  const transaction = await Transaction.findById(transaction_id)
    .populate({
      path: "requestComponents",
      populate: {
        path: "comp",
      },
    })
    .populate({
      path: "offerComponents",
      populate: {
        path: "comp",
      },
    });
  if (!transaction)
    return res.status(400).send({ msg: "No transaction found" });

  if (
    transaction.to.id.toString().trim() !==
    req.user.teams[0]._id.toString().trim()
  )
    return res.status(403).send({ msg: "Cant reject the offer" });
  if (transaction.status.value !== Transaction.states.SENT)
    return res
      .status(400)
      .send({ msg: "Cannot reject a finished transaction" });

  transaction.status = {
    value: Transaction.states.REJECTED,
    time: Date.now(),
  };
  await transaction.save();

  // send socket brodcast
  const session_handler = req.app.get("session_handler");
  session_handler.pushMessage(transaction.from.id.toString().trim(), {
    type: 2,
    status: Transaction.states.REJECTED,
    data: transaction,
  });
  res.send(transaction);
});

// * Cancel transaction
router.get("/cancel/:transaction_id", hasTeamID, async (req, res) => {
  const { transaction_id } = req.params;
  if (!transaction_id)
    return res.status(400).send({ msg: "INVALID TRANSACTION ID" });

  const transaction = await Transaction.findById(transaction_id)
    .populate({
      path: "requestComponents",
      populate: {
        path: "comp",
      },
    })
    .populate({
      path: "offerComponents",
      populate: {
        path: "comp",
      },
    });
  if (!transaction)
    return res.status(400).send({ msg: "No transaction found" });

  if (
    transaction.from.id.toString().trim() !==
    req.user.teams[0]._id.toString().trim()
  )
    return res.status(403).send({ msg: "Cant cancel the offer" });
  if (transaction.status.value !== Transaction.states.SENT)
    return res
      .status(400)
      .send({ msg: "Cannot cancel a finished transaction" });

  transaction.status = {
    value: Transaction.states.CANCELED,
    time: Date.now(),
  };
  await transaction.save();
  // console.log("canceled  ", transaction);

  // send socket brodcast
  const session_handler = req.app.get("session_handler");
  session_handler.pushMessage(transaction.to.id.toString().trim(), {
    type: 4,
    status: Transaction.states.CANCELED,
    data: transaction,
  });
  res.send(transaction);
});
module.exports = router;
