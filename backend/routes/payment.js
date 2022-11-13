const express = require("express");

const router = express.Router();

const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
});

router.post("/create/orderId", async (req, res, next) => {
  console.log(req.body);
  var options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: require("crypto").randomBytes(32).toString("hex"),
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.json({ orderId: order.id });
  });
});

module.exports = router;
