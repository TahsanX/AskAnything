const { default: mongoose } = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ Connected to Atlas (second project DB)"))
  .catch((err) => console.error("❌ Connection failed:", err));

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dr6co6lqx/image/upload/v1719917652/wrnpgs3xrlxtpvnxpo1u.jpg",
  },
});
module.exports = mongoose.model("User", UserSchema);
