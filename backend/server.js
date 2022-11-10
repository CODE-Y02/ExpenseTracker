const dotenv = require("dotenv"); // dot env
dotenv.config({ path: "../.env" });

const sequelize = require("./utils/database"); // import db pool

//  create express app
const express = require("express");

const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.json());

app.post("/User/signup", (req, res, next) => {
  console.log(req);
  res.json({ success: true, message: " Dummy response" });
});

const startApp = async () => {
  try {
    await sequelize.sync();

    app.listen(3000);
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log({ errorMsg: error.message, error });
    console.log("\n \n \n \n ");
  }
};

startApp();
