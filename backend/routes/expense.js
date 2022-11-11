const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expense");

router.get("/", expenseController.getAllExpense);

router.post("/addExpense", expenseController.postAddExpense);

module.exports = router;
