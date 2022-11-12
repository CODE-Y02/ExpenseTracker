const Expense = require("../models/expense");

module.exports.postAddExpense = async (req, res, next) => {
  try {
    // console.log("\n \n \n  ", req.user, "\n ", req.headers, " \n");

    const { expenseAmount, category, description } = req.body;

    // console.log("\n\n\n\n");
    // console.log(expenseAmount, category, description);
    // console.log("\n\n\n\n");

    if (!expenseAmount || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Field Cannot be empty" });
    }

    // let expense = await Expense.create({
    //   userId: user.id,
    //   expenseAmount,
    //   category,
    //   description,
    // });

    let expense = await req.user.createExpense({
      expenseAmount,
      category,
      description,
    });

    res
      .status(201)
      .json({ success: true, message: "Expense added successfully", expense });
  } catch (error) {
    console.log("\n \n", error, "\n");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllExpense = async (req, res, next) => {
  try {
    // let expenses = await Expense.findAll({ where: { userId: req.user.id } });
    let expenses = await req.user.getExpenses();
    // console.log("\n \n \n ", expenses);

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
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;

    if (!expenseId) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }
    let user = req.user;

    // console.log(user);

    let expense = await Expense.findOne({
      where: {
        id: expenseId,
        userId: user.id,
      },
    });
    // console.log("\n \n \n ", expense, "\n \n");
    if (!expense) {
      return res.status(401).json({
        success: false,
        message: "Expense Does Not Belongs to User",
        error: " Unauthorized Request",
      });
    }

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
