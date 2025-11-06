const joi = require("../validation/userJoi");
const userSchema = require("../models/userSchema");

const validate = async (req, res, next) => {
  const id = req.params.id;
  const user = await userSchema.findById(id);
  if (!user) {
    return next(new Error("User not found"));
  }

  if (!req.body.username) {
    req.body.username = user.username;
  }
  if (!req.body.email) {
    req.body.email = user.email;
  }
  if (!req.body.image) {
    req.body.image = user.image;
  }
  if (!req.body.password) {
    req.body.password = user.password;
  }

  if (joi.validate(req.body).error) {
    return next(joi.validate(req.body).error);
  }
  next();
};

module.exports = validate;
