const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expense");
const Expense = require("../models/expense");

router.get("/", expenseController.getAllExpense);

router.post("/addExpense", expenseController.postAddExpense);

router.delete("/delete/:expenseId", async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;

    if (!expenseId) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }

    Expense.findByPk(expenseId)
      .then(async (expense) => {
        if (!expense) {
          return res.status(404).json({
            success: false,
            message: "No Expense Found",
          });
        }
        console.log(expense);

        await expense.delete();
        res.json({
          success: true,
          message: "Expense deleted successfully",
        });
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
