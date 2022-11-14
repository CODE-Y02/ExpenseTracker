const Razorpay = require("razorpay");
const Order = require("../models/order");

exports.postcreateOrder = async (req, res, next) => {
  try {
    console.log(req.body.amount);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_TEST_KEY_ID,
      key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
    });

    let options = {
      amount: req.body.amount * 100, // amount is in paisa 100 paisa = 1 rs
      currency: "INR",
      receipt: require("crypto").randomBytes(8).toString("hex"),
    };
    await instance.orders.create(options, (err, order) => {
      // console.log(err);
      if (err) return res.status(err.statusCode).json({ error: err.error });

      const { id, amount, status, currency } = order;
      // console.log("\n\n order ==> \n");
      // console.log(id, amount, status, currency);

      Order.create({ userId: req.user.id, orderId: id })
        .then((order) => {
          return res
            .status(202)
            .json({ orderId: id, amount, status, currency });
        })
        .catch((error) => {
          return res.status(400).json({ success: false, error: error });
        });
    });

    // res.status(201).json({ order: createdOrder });
    // console.log("\n\n order ==> \n");
    // console.log(createdOrder);
    // console.log("\n\n ");
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const payDetails = req.body;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      payDetails;

    let userId = req.user.id;

    // find order
    let order = await Order.findOne({ where: { userId } });
    // get order id

    const { orderId } = order;

    const generated_signature = hmac_sha256(
      orderId + "|" + razorpay_payment_id,
      process.env.RAZORPAY_TEST_KEY_SECRET
    );

    if (generated_signature !== razorpay_signature) {
      // payment is UN successful
      return res.status(401).json({
        signatureIsValid: false,
        message: "payment From Unauthorized source",
      });
    }

    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;
    let crypto = require("crypto");
    let expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === req.body.response.razorpay_signature) {
      // update order status
      await order.update({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        isVarified: true,
      });

      await req.user.update({ membership: "premium" });

      return res.status(200).json({ signatureIsValid: true });
    }
    res.status(400).json({ signatureIsValid: false });
  } catch (error) {
    // console.log("\n\n ");
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
