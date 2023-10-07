const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "outcome"], // Only allow 'income' or 'outcome' as valid types
    required: true,
  },
});

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
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
  categories: {
    type: [CategorySchema],
    default: [
      // Default categories
      // Income categories
      { name: "Salary", type: "income" },
      { name: "Freelance", type: "income" },
      { name: "Investments", type: "income" },
      { name: "Rental Income", type: "income" },
      { name: "Gifts", type: "income" },
      { name: "Refunds", type: "income" },
      { name: "Royalties", type: "income" },

      // Outcome categories
      { name: "Rent", type: "outcome" },
      { name: "Groceries", type: "outcome" },
      { name: "Utilities", type: "outcome" },
      { name: "Dining Out", type: "outcome" },
      { name: "Transportation", type: "outcome" },
      { name: "Entertainment", type: "outcome" },
      { name: "Healthcare", type: "outcome" },
    ],
  },
});

const UserModels = mongoose.model("users", UserSchema);

module.exports = UserModels;
