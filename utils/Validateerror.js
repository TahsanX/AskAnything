const joi = require("../validation/errorjoi");
const userJoi = require("../validation/userJoi");
const validate = async (req, res, next) => {
  if (joi.validate(req.body).error) {
    return next(joi.validate(req.body).error);
  }
  next();
};
module.exports = validate;
module.exports.userJoi = async (req, res, next) => {
  if (userJoi.validate(req.body).error) {
    return next(userJoi.validate(req.body).error);
  }
  next();
};
