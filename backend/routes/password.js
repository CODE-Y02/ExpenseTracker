const express = require("express");

const router = express.Router();

const forgotPassControllers = require("../controllers/forgotPassword");

router.post("/forgotpassword", forgotPassControllers.postForgotPass);

router.get("/reset/:resetToken", forgotPassControllers.getResetPass);
router.post("/reset/:resetToken", forgotPassControllers.postResetPass);

module.exports = router;
