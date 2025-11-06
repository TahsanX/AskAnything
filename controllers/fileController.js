const File = require("../models/fileschema");
const UserModel = require("../models/userSchema");
module.exports.all = async (req, res) => {
  const token = req.session.token;
  var usertocheck;
  var personDetails;
  if (token) {
    usertocheck = req.user.username;
    personDetails = await UserModel.findOne({ username: usertocheck });
  }
  var get = await File.find().populate("user");
  if (req.query.search) {
    const obj = await File.find({
      Title: { $regex: req.query.search, $options: "i" },
    }).populate("user");
    get = obj;
  }
  res.render("index", { get, token, usertocheck, personDetails });
};

module.exports.newGet = (req, res) => {
  const token = req.session.token;
  const personDetails = req.session.personDetails;
  res.render("new", { token, personDetails });
};

module.exports.newPost = async (req, res) => {
  const obj = req.body;
  const user = req.user;
  const userId = await UserModel.findOne({ username: user.username });
  obj.user = userId._id;
  console.log(obj);
  await File.insertMany(obj);
  req.flash("success", "New Item added");
  res.redirect("/all");
};
module.exports.view = async (req, res) => {
  const id = req.params.id;
  const sessionuser = req.user;
  const personDetails = req.session.personDetails;
  const token = req.session.token;
  let obj = await File.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "user",
        select: "username",
      },
    })
    .populate("user");
  res.render("view", { obj, token, sessionuser, personDetails });
};
module.exports.updateGet = async (req, res) => {
  const id = req.params.id;
  const personDetails = req.session.personDetails;
  const token = req.session.token;
  const obj = await File.findById({ _id: id });
  res.render("update", { obj, token, personDetails });
};
module.exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const obj = req.body;
  await File.findByIdAndUpdate(id, obj, { new: true });
  req.flash("success", "Item Updated");
  res.redirect("/all");
};
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await File.findByIdAndDelete(id);
  req.flash("success", "Item deleted");
  res.redirect("/all");
};
module.exports.search = async (req, res) => {
  var query = req.body;
  query = query.title;
  res.redirect(`/all?search=${query}`);
};
