const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expense");

const userAuth = require("../middleware/auth");
router.get("/", userAuth.authentication, expenseController.getAllExpense);

router.post(
  "/addExpense",
  userAuth.authentication,
  expenseController.postAddExpense
);

router.delete(
  "/delete/:expenseId",
  userAuth.authentication,
  expenseController.deleteExpense
);

module.exports = router;
