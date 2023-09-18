const mongoose = require("mongoose");

const BalancesSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "Please enter a user id"],
  },
  balance: {
    type: Number,
    required: [true, "Please enter a balance"],
    default: 0,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

const BalancesModels = mongoose.model("balances", BalancesSchema);

module.exports = BalancesModels;
