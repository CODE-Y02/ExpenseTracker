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
const paymentRouter = require("./routes/payment");
const passwordRoute = require("./routes/password");
const leaderBoardRoute = require("./routes/leaderboard");

// import models
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const LeaderBoard = require("./models/leaderboard");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

LeaderBoard.belongsTo(User);
User.hasOne(LeaderBoard);

app.use("/user", userRoutes);
app.use("/expense", expenseRouter);
app.use("/payment", paymentRouter);

app.use("/password", passwordRoute);
app.use("/leaderboard", leaderBoardRoute);

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
