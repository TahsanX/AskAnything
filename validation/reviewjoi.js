const Joi = require("joi");

const model = Joi.object({
  Solution: Joi.string().trim().min(3).required(),
  rating: Joi.number().min(1).required(),
});

module.exports = model;
