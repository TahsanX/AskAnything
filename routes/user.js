const express = require("express");
const route = express.Router({ mergeParams: true });
const asyncwrap = require("../utils/wrapasync");
const nodemailer = require("nodemailer");
const requireOtpSession = require("../utils/requireOtpSession");
const otpGenerator = require("otp-generator");
const OTPModel = require("../models/otpSchema");
const userSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Expresserror = require("../validation/expresserror");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const editUserController = require("../controllers/editUserController");
const editUserValidate = require("../utils/userEditValidation");
const verifyToken = require("../utils/verifytoken");
const validaterror = require("../utils/Validateerror");
require("dotenv").config();

route.get("/signup", (req, res) => {
  res.render("signup");
});
route.get("/", (req, res) => {
  res.redirect("/all");
});

route.get("/otp", requireOtpSession, (req, res) => {
  res.render("otp", { email: req.session.otpEmail });
});
route.get("/login", (req, res) => {
  res.render("login");
});
route.post(
  "/signup",
  validaterror.userJoi,
  asyncwrap(async (req, res) => {
    let { username, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new userSchema({
      username: username,
      email: email,
      password: hashedpassword,
    });
    try {
      await newUser.save();
    } catch (error) {
      throw new Expresserror("409", "Username or email exsists please login");
    }
    res.redirect("/login");
  })
);
route.post(
  "/login",
  asyncwrap(async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await userSchema.findOne({ username });

      if (!user) {
        return next(new Expresserror("500", "Wrong credentials"));
      }

      const comparing = await bcrypt.compare(password, user.password);
      if (!comparing) {
        return next(new Expresserror("500", "Wrong credentials"));
      }

      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      const email = user.email;

      // Remove old OTPs and create new one
      await OTPModel.deleteMany({ email });
      await OTPModel.create({ email, otp });

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}`,
      });

      // 🔹 Start temporary OTP session
      req.session.otpEmail = email;
      req.session.otpIssuedAt = Date.now();

      // Redirect to OTP page
      res.redirect("/otp");
    } catch (err) {
      console.error("🔥 Error in /login route:", err);
      next(err);
    }
  })
);

route.post(
  "/otp",
  asyncwrap(async (req, res, next) => {
    const { otp } = req.body;
    const email = req.session.otpEmail;

    if (!email) {
      return next(
        new Expresserror("400", "OTP session expired or not started")
      );
    }

    const otpEntry = await OTPModel.findOne({ email, otp });
    if (!otpEntry) {
      return next(new Expresserror("400", "Invalid OTP"));
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return next(new Expresserror("404", "User not found"));
    }

    // Delete OTP and temporary session
    await OTPModel.deleteMany({ email });
    delete req.session.otpEmail;
    delete req.session.otpIssuedAt;

    // 🔹 Start real session
    const token = jwt.sign({ username: user.username }, "secretkey", {
      expiresIn: "1h",
    });
    req.session.token = token;

    jwt.verify(token, "secretkey", (err, decoded) => {
      if (err) return next(err);
      req.user = decoded;
      req.flash("success", `${req.user.username} you are logged in`);
    });

    res.redirect("/all");
  })
);

route.get("/logout", verifyToken, (req, res) => {
  req.session.destroy();
  res.redirect("/all");
});
route.post(
  "/:id/edit-user",
  verifyToken,
  upload.single("image"),
  asyncwrap(editUserController)
);
module.exports = route;
