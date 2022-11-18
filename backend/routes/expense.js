const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expense");

const { authentication, isPremiumUser } = require("../middleware/auth");

router.get("/", authentication, expenseController.getAllExpense);

router.post("/addExpense", authentication, expenseController.postAddExpense);

router.delete(
  "/delete/:expenseId",
  authentication,
  expenseController.deleteExpense
);

router.get(
  "/download",
  authentication,
  isPremiumUser,
  expenseController.downloadExpenseReport
);

module.exports = router;
