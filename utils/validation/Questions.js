const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const submitAnswer = (body) => {
  const schema = Joi.object({
    cart: Joi.object().required(),
    components: Joi.array()
      .items(
        Joi.object({
          comp: Joi.objectId().required(),
          qty: Joi.number().integer().greater(0).required(),
        })
      )
      .required(),
  });
  return schema.validate(body);
};
const add = (body) => {
  const schema = Joi.object({
    image: Joi.string(),
    question: Joi.string().required(),
    type: Joi.valid("round1", "round2", "round3"),
  });
  return schema.validate(body);
};

module.exports = {
  add,
  submitAnswer,
};
