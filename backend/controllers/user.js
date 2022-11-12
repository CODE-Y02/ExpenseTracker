const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.postSignUp = async (req, res, next) => {
  try {
    let name = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;

    console.log("\n \n \n");
    // console.log(name);
    // console.log(req.body);

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      // if (err) throw new Error("Something Went Wrong");
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw new Error("Something Went Wrong");
        User.create({ name, email, password: hash })
          .then((user) => {
            res
              .status(201)
              .json({ success: true, message: "SignUp successful" });
          })
          .catch((error) => {
            console.log("\n \n \n \n ");
            console.log(error);
            return res.status(409).json({
              success: false,
              error: error.message,
              message: " Email Already exist ",
            });
          });
      });
    });

    console.log("\n \n \n \n  Generated Hash ==> \n");
    // console.log(generatedHash);
    console.log("\n \n \n \n ");
    // await User.create({ name, email, password: generatedHash });
    // res.json({ success: true, message: "SignUp successful" });
  } catch (error) {
    // console.log("\n \n \n \n ");
    console.log(error);

    // if (error.fields.email) {
    //   //email already exist
    //   return res.status(409).json({
    //     success: false,
    //     error: error.message,
    //     message: " Email Already exist ",
    //   });
    // } else {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    // }
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
