const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("Order", {
  orderNo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  orderId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  razorpay_order_id: Sequelize.STRING,
  razorpay_payment_id: Sequelize.STRING,
  razorpay_signature: Sequelize.STRING,
  isVarified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Order;
