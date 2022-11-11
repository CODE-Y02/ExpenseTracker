const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expense");
const Expense = require("../models/expense");

router.get("/", expenseController.getAllExpense);

router.post("/addExpense", expenseController.postAddExpense);

router.delete("/delete/:expenseId", expenseController.deleteExpense);

module.exports = router;
