const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.postSignUp = async (req, res, next) => {
  try {
    let name = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;

    // const { name: userName, email, password } = req.body;

    console.log(req.body);

    const saltRounds = 10;

    // bcrypt.hash(password, saltRounds, async function (err, hash) {
    //   try {
    //     if (err) throw new Error("Something Went Wrong");

    //     if (hash) {
    //       let user = await User.create({ name, email, password: hash });
    //       return res.json({ success: true, message: "SignUp successful" });
    //     }
    //   } catch (error) {
    //     res.status(409).json({
    //       success: false,
    //       message: error.message,
    //       error: "email already exist ",
    //     });

    //   }
    // });
    let generatedHash = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject("Something Went Wrong");
        //hash; // true or false
        resolve(hash);
      });
    });

    if (generatedHash) {
      await User.create({ name, email, password: generatedHash });
      res.json({ success: true, message: "SignUp successful" });
    } else {
      return res.status(409).json({
        success: false,
        error: "email already exist ",
      });
    }
  } catch (error) {
    console.log("\n \n \n \n ");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
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
        res.json({
          success: true,
          message: "Login successfull",
          Token: generateAccessToken(user[0].id, user[0].name),
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Wrong password",
          message: "User not authorized",
        });
      }
    });

    console.log("\n \n \n");
    // console.log();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    // console.log("\n \n \n");

    // console.log(error);
  }
};

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, process.env.SECRET_KEY);
}
