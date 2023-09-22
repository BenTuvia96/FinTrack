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

app.post("/addUser", async (req, res) => {
  const { username, email, password } = req.body;
  // Check if the username already exists in the database
  const existingUser = await UserModels.findOne({ username });

  if (existingUser) {
    // Username already exists, send an error response
    return res.status(400).json({ error: "Username already in use" });
  }

  try {
    const newUser = new UserModels({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error while adding user" });
  }
});

app.post("/checkUsername", async (req, res) => {
  try {
    const existingUser = await UserModels.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      // Username is already in use
      res.json({ error: "Username is already taken" });
    } else {
      // Username is available
      res.json({ success: true });
    }
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
