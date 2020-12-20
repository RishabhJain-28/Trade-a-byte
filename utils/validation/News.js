const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const add = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
  });
  return schema.validate(body);
};

module.exports = {
  add,
};
