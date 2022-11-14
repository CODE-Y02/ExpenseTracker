const express = require("express");

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
const router = express.Router();

const bcrypt = require("bcrypt");

router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      //if user not found then
      return res
        .status(404)
        .json({ success: false, message: "User Not Fount " });
    }

    // send password verification likn

    const passResetToken = generateAccessToken(user.id, user.name);
    res.setHeader("Content-Type", "text/html");

    res.write(`
    <a href="http://localhost:3000/password/reset/${passResetToken}">Reset Password</a>
    `);
    res.status(200);
    res.end();

    console.log("\n\n user ===> \n ", user, "\n\n");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/reset/:resetToken", async (req, res) => {
  try {
    const token = req.params.resetToken;
    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    let user = await User.findByPk(userObj.userId);

    if (!user) {
      return res.status(404);
    }

    res.sendFile(path.join(__dirname, "../", "views", "passwordReset.html"));

    console.log("\n\n user ===> \n ", "\n\n");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/reset/:resetToken", async (req, res) => {
  try {
    const token = req.params.resetToken;
    const { newPass } = req.body;

    const userObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    let user = await User.findByPk(userObj.userId);

    if (!user) {
      return res.status(404);
    }
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPass, salt, (err, hash) => {
        console.log(err);
        if (err) throw new Error("Something Went Wrong");
        user
          .update({ password: hash })
          .then((user) => {
            res
              .status(201)
              .json({ success: true, message: "Reset successful" });
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

    // console.log("\n\n user ===> \n ", "\n\n");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    process.env.ACCESS_TOKEN_SECRET_KEY
  );
}
module.exports = router;
