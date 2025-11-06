const Joi = require('joi');

const model = Joi.object({
    Title: Joi.string().trim().min(3).max(30).required(),
    Description: Joi.string().trim().min(2).required()
});

module.exports = model;
