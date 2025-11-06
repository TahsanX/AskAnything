const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");
const verifyToken = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/login");
  }
  jwt.verify(token, "secretkey", async (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }
    req.user = decoded;
    const personDetails = await userModel.findOne({
      username: req.user.username,
    });
    req.session.personDetails = personDetails;
    next();
  });
};
module.exports = verifyToken;
