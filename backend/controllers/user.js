const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.postSignUp = async (req, res, next) => {
  try {
    let name = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      console.log(err);
      // Store hash in your password DB.
      await User.create({ name, email, password: hash });
      res.json({ success: true, message: "SignUp successful" });
    });
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log(error);

    if (error.fields) {
      // email already exist
      res.status(409).json({
        success: false,
        message: error.message,
        error: "email already exist ",
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.postSignIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    let user = await User.findAll({
      where: { email: email },
    });

    if (user.length == 0) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const hash = user[0].password;

    bcrypt.compare(password, hash, function (err, result) {
      // result == true

      if (err) throw new Error("Something Went Wrong !!!");
      if (result) {
        res.json({ success: true, message: "Login successfull" });
      } else {
        return res.status(401).json({
          success: false,
          error: "Wrong password",
          message: "User not authorized",
        });
      }
    });

    // console.log("\n \n \n");
    // console.log(isPassWordValid);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    // console.log("\n \n \n");

    // console.log(error);
  }
};
