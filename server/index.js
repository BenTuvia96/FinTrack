const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModels = require("./models/Users");
const TransactionsModels = require("./models/Transactions");
const BalancesModels = require("./models/Balances");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://shaked:Aa123456@fintrack0.njassft.mongodb.net/FinTrack?retryWrites=true&w=majority",
  {}
);

app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModels.find({});
    res.json(users);
  } catch (err) {
    res.json(err);
  }
});

app.get("/getTransactions", async (req, res) => {
  try {
    const transactions = await TransactionsModels.find({});
    res.json(transactions);
  } catch (err) {
    res.json(err);
  }
});

app.post("/addUser", async (req, res) => {
  try {
    const newUser = new UserModels({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.json(err);
  }
});

app.post("/addExpense", async (req, res) => {
  try {
    const newExpense = new TransactionsModels({
      user_id: req.body.user_id,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
      note: req.body.note,
      kind: req.body.kind,
    });
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.json(err);
  }
});

app.listen(3001, () => {
  console.log("server running on port 3001");
});
