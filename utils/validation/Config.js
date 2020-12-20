const Joi = require("joi");

const round = (body) => {
  const schema = Joi.object({
    currentRound: Joi.string().valid("round1", "round2", "round3").required(),
  });
  return schema.validate(body);
};

module.exports = {
  round,
};
