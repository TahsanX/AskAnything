const fileSchema = require("../models/fileschema");
const expressError = require("../validation/expresserror");
const sameUser = async (req, res, next) => {
  const user = req.user.username;
  const id = req.params.id;
  const obj = await fileSchema.findOne({ _id: id }).populate("user");
  if (obj.user.username === user) {
    next();
  } else {
    next(new expressError("500", "You are not allowed to change this item"));
  }
};
module.exports = sameUser;
