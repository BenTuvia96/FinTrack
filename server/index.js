const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModels = require("./models/Users");
const TransactionsModels = require("./models/Transactions");
const { BalancesModels, updateBalance } = require("./models/Balances");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModels.find({});
    res.json(users);
  } catch (err) {
    res.json(err);
  }
});

app.get("/getTransactions/:userId", async (req, res) => {
  try {
    let filter = {
      user_id: req.params.userId,
    };

    if (req.query.startDate && req.query.endDate) {
      let endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999); // Set time to the end of the day
      filter.time = {
        $gte: new Date(req.query.startDate),
        $lte: endDate,
      };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Add this to handle the kind query parameter
    if (req.query.kind) {
      filter.kind = req.query.kind;
    }

    const transactions = await TransactionsModels.find(filter);
    res.json(transactions);
  } catch (err) {
    res.json(err);
  }
});

const bcrypt = require("bcryptjs");

async function isCategoryValid(userId, category) {
  const user = await UserModels.findById(userId);
  if (!user) {
    return false;
  }
  return user.categories.some((cat) => cat.name === category);
}

app.post("/addUser", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await UserModels.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ error: "Username already in use" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = new UserModels({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error while adding user" });
  }
});

const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Use email instead of username
  const user = await UserModels.findOne({ email }); // Find user by email

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Create a JWT
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "5h",
  });

  res.json({ token });
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
    const isValidCategory = await isCategoryValid(
      req.body.user_id,
      req.body.category
    );
    if (!isValidCategory) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const newExpense = new TransactionsModels({
      user_id: req.body.user_id,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
      note: req.body.note,
      kind: req.body.kind,
    });
    await newExpense.save();
    console.log("newExpense:", newExpense);
    console.log("new Date(newExpense.date):", new Date(newExpense.date));

    // Update balance after adding an expense
    await updateBalance(
      req.body.user_id,
      req.body.amount,
      new Date(req.body.date),
      "expense"
    );

    res.json(newExpense);
  } catch (err) {
    res.json(err);
  }
});

app.post("/addIncome", async (req, res) => {
  try {
    const isValidCategory = await isCategoryValid(
      req.body.user_id,
      req.body.category
    );
    if (!isValidCategory) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const newIncome = new TransactionsModels({
      user_id: req.body.user_id,
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
      note: req.body.note,
      kind: "income",
    });
    await newIncome.save();

    // Update balance after adding an income
    await updateBalance(
      req.body.user_id,
      req.body.amount,
      new Date(req.body.date),
      "income"
    );

    res.json(newIncome);
  } catch (err) {
    res.json(err);
  }
});

// Get monthly balance for a given user and year
app.get("/getMonthlyBalances/:userId/:year", async (req, res) => {
  try {
    const balances = await BalancesModels.find({
      user_id: req.params.userId,
      year: parseInt(req.params.year),
    });
    res.json(balances);
  } catch (err) {
    res.json(err);
  }
});

// Get monthly balance for a given user for current and previous year
app.get("/getYearlyComparisonBalances/:userId/:year", async (req, res) => {
  try {
    const currentYear = parseInt(req.params.year);
    const previousYear = currentYear - 1;

    const currentYearBalances = await BalancesModels.find({
      user_id: req.params.userId,
      year: currentYear,
    });

    const previousYearBalances = await BalancesModels.find({
      user_id: req.params.userId,
      year: previousYear,
    });

    res.json({
      currentYear: currentYearBalances,
      previousYear: previousYearBalances,
    });
  } catch (err) {
    res.json(err);
  }
});

// Get yearly balance for a given user
app.get("/getYearlyBalance/:userId/:year", async (req, res) => {
  try {
    const balances = await BalancesModels.find({
      user_id: req.params.userId,
      year: parseInt(req.params.year),
    });

    const yearlyTotal = balances.reduce(
      (acc, curr) => {
        return {
          income: acc.income + curr.income,
          outcome: acc.outcome + curr.outcome,
          balance: acc.balance + curr.balance,
        };
      },
      { income: 0, outcome: 0, balance: 0 }
    );

    res.json(yearlyTotal);
  } catch (err) {
    res.json(err);
  }
});

function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
}

app.get("/getUserDetails", verifyToken, async (req, res) => {
  try {
    const user = await UserModels.findById(req.user.id);
    if (user) {
      res.json({
        username: user.username,
        email: user.email,
        userID: req.user.id,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.json(err);
  }
});

app.delete("/deleteTransaction/:transactionId", async (req, res) => {
  try {
    const deletedTransaction = await TransactionsModels.findByIdAndRemove(
      req.params.transactionId
    );
    if (deletedTransaction) {
      // Reverse the effects of the deleted transaction
      await updateBalance(
        deletedTransaction.user_id,
        -deletedTransaction.amount, // Negative because we're removing it
        new Date(deletedTransaction.time),
        deletedTransaction.kind === "income" ? "income" : "expense"
      );

      res.json({ success: true, message: "Transaction deleted successfully" });
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting transaction" });
  }
});

app.put("/editTransaction/:transactionId", async (req, res) => {
  try {
    const isValidCategory = await isCategoryValid(
      req.body.user_id,
      req.body.category
    );
    if (!isValidCategory) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const existingTransaction = await TransactionsModels.findById(
      req.params.transactionId
    );
    if (!existingTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const { amount, category, note, kind, time } = req.body;
    const updatedData = {
      amount: parseFloat(amount),
      category,
      time,
      note,
      kind,
    };

    const updatedTransaction = await TransactionsModels.findByIdAndUpdate(
      req.params.transactionId,
      updatedData,
      { new: true }
    );

    // Reverse the effects of the original transaction
    await updateBalance(
      existingTransaction.user_id,
      -existingTransaction.amount,
      new Date(existingTransaction.time),
      existingTransaction.kind === "income" ? "income" : "expense"
    );

    // Apply the effects of the updated transaction
    await updateBalance(
      updatedTransaction.user_id,
      updatedTransaction.amount,
      new Date(updatedTransaction.time),
      updatedTransaction.kind === "income" ? "income" : "expense"
    );

    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ error: "Error updating transaction" });
  }
});

app.post("/addCategory/:userId", async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type || (type !== "income" && type !== "outcome")) {
    return res.status(400).json({ error: "Invalid category data" });
  }

  try {
    const user = await UserModels.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if category already exists
    const categoryExists = user.categories.some((cat) => cat.name === name);
    if (categoryExists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    user.categories.push({ name, type });
    await user.save();

    res.status(201).json({ success: true, category: { name, type } });
  } catch (err) {
    res.status(500).json({ error: "Error adding category" });
  }
});

app.delete("/removeCategory/:userId", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name required" });
  }

  try {
    const user = await UserModels.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const categoryIndex = user.categories.findIndex((cat) => cat.name === name);
    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    user.categories.splice(categoryIndex, 1);
    await user.save();

    res.status(200).json({ success: true, message: "Category removed" });
  } catch (err) {
    res.status(500).json({ error: "Error removing category" });
  }
});

// getCategories
app.get("/getCategories/:userId", async (req, res) => {
  try {
    const user = await UserModels.findById(req.params.userId);
    if (user) {
      res.json(user.categories);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3001, () => {
  console.log("server running on port 3001");
});
