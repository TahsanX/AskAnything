const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const OTPModel = mongoose.model("OTP", otpSchema);
module.exports = OTPModel;
