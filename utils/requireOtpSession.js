module.exports = (req, res, next) => {
  const email = req.session.otpEmail;
  if (!email) return res.redirect("/login");

  if (Date.now() - req.session.otpIssuedAt > 5 * 60 * 1000) {
    delete req.session.otpEmail;
    delete req.session.otpIssuedAt;
    return res.redirect("/login");
  }

  next();
};
