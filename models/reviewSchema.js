const { default: mongoose } = require("mongoose");
const user = require("./userSchema");
const Schema = mongoose.Schema;

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ Connected to Atlas (second project DB)"))
  .catch((err) => console.error("❌ Connection failed:", err));

const ReviewSchema = new Schema({
  Solution: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const review = mongoose.model("review", ReviewSchema);

module.exports = review;
