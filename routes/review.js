const express = require("express");
const asyncwrap = require("../utils/wrapasync");
const reviewvalidate = require("../utils/reviewerror");
const reviewController = require("../controllers/reviewController");
const verifyToken = require("../utils/verifytoken");
const route = express.Router({ mergeParams: true });

route.post(
  "/",
  reviewvalidate,
  verifyToken,
  asyncwrap(reviewController.createReview)
);
route.get("/:reviewid", verifyToken, asyncwrap(reviewController.deleteReview));

module.exports = route;
