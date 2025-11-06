const Joi = require("joi");

const model = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().min(2).required(),
  password: Joi.string().trim().min(2).required(),
  image: Joi.string().uri().optional(),
});

module.exports = model;
