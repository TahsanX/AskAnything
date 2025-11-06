const cloudinary = require("cloudinary");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Expresserror = require("../validation/expresserror");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const edituser = async (req, res, next) => {
  try {
    let body = req.body;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      body.image = result.secure_url;
    }

    const id = req.params.id;

    const obj = await userSchema.findById({ _id: id });

    if (!obj) {
      return next(new Expresserror("404", "User not found"));
    }
    if (body.password && body.password.trim() !== "") {
      const isSamePassword = await bcrypt.compare(body.password, obj.password);

      if (!isSamePassword) {
        body.password = await bcrypt.hash(body.password, 10);
      } else {
        delete body.password;
      }
    } else {
      delete body.password;
    }

    const updatedUser = await userSchema.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.redirect("/logout");
  } catch (err) {
    next(err);
  }
};

module.exports = edituser;
