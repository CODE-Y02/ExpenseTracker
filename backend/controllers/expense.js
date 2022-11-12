const Expense = require("../models/expense");

module.exports.postAddExpense = async (req, res, next) => {
  try {
    // console.log("\n \n \n  ", req.user, "\n ", req.headers, " \n");

    const { expenseAmount, category, description } = req.body;
    if (!expenseAmount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Field Cannot be empty" });
    }
    let user = req.user;

    let expense = await Expense.create({
      userId: user.id,
      expenseAmount,
      category,
      description,
    });

    res
      .status(201)
      .json({ success: true, message: "Expense added successfully", expense });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllExpense = async (req, res, next) => {
  try {
    let expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log("\n \n \n ");
    // console.log(req.headers.authorization);

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
    // console.log("\n \n \n  ", req.body, "\n ", req.headers, " \n");

    const expenseId = req.params.expenseId;

    if (!expenseId) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }
    let user = req.user;

    console.log(user);

    let expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: user.id,
      },
    });
    // console.log(expense);
    await expense.destroy();
    res.json({ success: true, message: "Expense Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
