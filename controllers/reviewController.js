const userModel = require("../models/userSchema");
const reviewModel = require("../models/reviewSchema");
const File = require("../models/fileschema");
module.exports.createReview = async (req, res) => {
  const id = req.params.id;
  const user = req.user.username;
  const searching = await userModel.findOne({ username: user });
  const hello = req.body;
  const newreview = new reviewModel(hello);
  newreview.user = searching._id;
  await newreview.save();
  const filemain = await File.findById({ _id: id });
  filemain.review.push(newreview);
  await filemain.save();
  res.redirect(`/all/${id}/view`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewid } = req.params;
  await File.findByIdAndUpdate(id, { $pull: { review: reviewid } });
  await reviewModel.findByIdAndDelete(reviewid);
  res.redirect(`/all/${id}/view`);
};
