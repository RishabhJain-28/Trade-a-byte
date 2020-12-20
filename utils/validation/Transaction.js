const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const offer = (body) => {
  const schema = Joi.object({
    code: Joi.string().min(5).trim().required(),
    requestComponents: Joi.object().required(),
    offerComponents: Joi.object().required(),
    requestAmount: Joi.number().integer().min(0).required(),
    offerAmount: Joi.number().integer().min(0).required(),
  });
  return schema.validate(body);
};
exports.offer = offer;
module.exports = {
  offer,
};
