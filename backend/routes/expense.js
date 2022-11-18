const express = require("express");

const fs = require("fs");
const path = require("path");
const rootPath = require("../util/rootDir");

const router = express.Router();

const expenseController = require("../controllers/expense");

const userAuth = require("../middleware/auth");
const { convertFromJSON_to_CSV } = require("../util/jsonToCsv");
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

router.get("/download", userAuth.authentication, async (req, res) => {
  try {
    const user = req.user;
    if (user.membership == "free") {
      return res.status(401).json({
        success: false,
        message: "Buy Premium Membership To access this feature",
      });
    } else {
      // get
      let expenses = await req.user.getExpenses();

      if (expenses.length == 0) {
        return res.status(404).json({
          success: false,
          message: "No Expense Found",
        });
      }

      expenses = expenses.map((expenseObj) => {
        const {
          id,
          expenseAmount,
          category,
          description,
          updatedAt,
          createdAt,
        } = expenseObj;
        return {
          id,
          expenseAmount,
          category,
          description,
          createdAt,
          updatedAt,
        };
      });

      let csv = await convertFromJSON_to_CSV(expenses);

      console.log(csv);

      fs.writeFile(`./files/${user.email}.csv`, csv, (err) => {
        if (err) res.json({ success: false, err });

        res.status(200).json({
          filename: `dataReport_${user.email}`,

          fileUrl: path.join(rootPath, `/files/${user.email}.csv`),
        });
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
