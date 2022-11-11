const Expense = require("../models/expense");

module.exports.postAddExpense = async (req, res, next) => {
  try {
    const { expenseAmount, category, description } = req.body;
    if (!expenseAmount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Field Cannot be empty" });
    }

    await Expense.create({ expenseAmount, category, description });

    res
      .status(201)
      .json({ success: true, message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllExpense = async (req, res, next) => {
  try {
    let expenses = await Expense.findAll();
    // console.log("\n \n \n ");
    // console.log(expenses);

    if (expenses.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Expense Found",
      });
    }

    expenses = expenses.map((expenseObj) => {
      const { id, expenseAmount, category, description } = expenseObj;
      return {
        id,
        expenseAmount,
        category,
        description,
      };
    });

    res
      .status(200)
      .json({ success: true, message: "Found All Expenses", expenses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteExpense = async (req, res, next) => {
  try {
    if (!expenseId) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }

    let expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "No Expense Found",
      });
    }

    await expense.delete();
    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
