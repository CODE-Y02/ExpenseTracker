const User = require("../models/user");

exports.postSignUp = async (req, res, next) => {
  try {
    let newUser = {
      name: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    };

    let user = await User.create(newUser);
    console.log(user);
    res.json({ success: true, message: "SignUp successful" });
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
