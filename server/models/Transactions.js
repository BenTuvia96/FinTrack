const mongoose = require("mongoose");

const TransactionsScheme = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "Please enter a user id"],
  },
  amount: {
    type: Number,
    required: [true, "Please enter an amount"],
  },
  category: {
    type: String,
    required: [true, "Please enter a category"],
    default: "uncategorized",
  },
  time: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },

  kind: {
    type: String,
    required: [true, "Please enter a kind"],
  },
});

const TransactionsModels = mongoose.model("transactions", TransactionsScheme);

module.exports = TransactionsModels;
