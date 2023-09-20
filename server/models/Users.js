const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a full name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, //TODO: fix verification to suit DB verification
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password should be at least 6 characters"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserModels = mongoose.model("users", UserSchema);

module.exports = UserModels;
