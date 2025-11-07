const express = require("express");
const app = express();
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 10000;
const path = require("path");
const cookieParser = require("cookie-parser");
const allfile = require("./routes/File");
const allreview = require("./routes/review");
const alluser = require("./routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
var cors = require("cors");
require("dotenv").config();
//cors
app.use(cors());
//express session
app.use(
  session({
    secret: process.env.SECRET_KEY || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO,
      ttl: 14 * 24 * 60 * 60, // Session valid for 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
//flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  const token = req.session.token;
  jwt.verify(token, "secretkey", (err, decoded) => {
    req.user = decoded;
    if (token) {
      res.locals.Username = req.user.username;
    }
  });
  next();
});
//cookie parser
app.use(cookieParser());
//Middleware for EJS
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.set("/views", path.join(__dirname, "views"));

//Url Encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// routes
app.use("/all", allfile);
// user route
app.use("/", alluser);
//review route
app.use("/all/:id/reviews", allreview);

//Middleware for error
app.all("*", (req, res, next) => {
  res.render("404");
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Some Error Occured" } = err;
  res.render("alert", { status, message });
});
// port listining
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Listening on port ${PORT}`);
});

server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 130000; // slightly higher
