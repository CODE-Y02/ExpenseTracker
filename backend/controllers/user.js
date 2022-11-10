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

exports.postSignIn = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    let user = await User.findAll({
      where: { email: email, password: password },
    });

    if (user.length == 0) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    res.json({ success: true, message: "Login successfull" });
    // console.log("\n \n \n");
    // console.log(user);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    // console.log("\n \n \n");

    // console.log(error);
  }
};
