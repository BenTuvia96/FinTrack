const mongoose = require("mongoose");

const BalancesSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "Please enter a user id"],
  },
  income: {
    type: Number,
    default: 0,
  },
  outcome: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

async function updateBalance(userId, amount, date, kind) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Ensure amount is a number
  const numericAmount = parseFloat(amount);

  let balance = await BalancesModels.findOne({
    user_id: userId,
    year: year,
    month: month,
  });

  if (!balance) {
    balance = new BalancesModels({
      user_id: userId,
      year: year,
      month: month,
    });
  }

  if (kind === "income") {
    balance.income += numericAmount;
  } else if (kind === "expense") {
    balance.outcome += numericAmount;
  }

  balance.balance = balance.income - balance.outcome;
  balance.last_updated = Date.now();
  await balance.save();
}

const BalancesModels = mongoose.model("balances", BalancesSchema);

module.exports = {
  BalancesModels: BalancesModels,
  updateBalance: updateBalance,
};
