const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const app = express();
dotenv.config({ path: "../.env" });

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

// import routes
const userRoutes = require("./routes/user");
const expenseRouter = require("./routes/expense");

// import models
const User = require("./models/user");
const Expense = require("./models/expense");

User.hasMany(Expense);
Expense.belongsTo(User);

app.use("/user", userRoutes);
app.use("/expense", expenseRouter);

const startApp = async () => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();

    app.listen(3000);
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log({ errorMsg: error.message, error });
    console.log("\n \n \n \n ");
  }
};

startApp();
