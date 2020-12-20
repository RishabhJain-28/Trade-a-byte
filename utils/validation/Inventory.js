const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const buyComponents = (body) => {
  const schema = Joi.object({
    components: Joi.array()
      .items(
        Joi.object({
          _id: Joi.objectId().required(),
          qty: Joi.number().integer().greater(0).required(),
        })
      )
      .required(),
  });
  return schema.validate(body);
};
const increasePriceForAll = (body) => {
  const schema = Joi.object({
    factor: Joi.number().required(),
  });
  return schema.validate(body);
};
const increasePriceForOne = (body) => {
  const schema = Joi.object({
    component: Joi.objectId().required(),
    factor: Joi.number().required(),
  });
  return schema.validate(body);
};

module.exports = {
  buyComponents,
  increasePriceForAll,
  increasePriceForOne,
};
