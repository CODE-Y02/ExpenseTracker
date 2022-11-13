import "https://checkout.razorpay.com/v1/checkout.js";
import axios from "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

const createOrder = async (amount) => {
  try {
    let response = await axios.post("localhost:3000/payment/create/orderId", {
      amount: amount,
    });

    let orderId = response.orderId;
    return orderId;
  } catch (error) {
    console.log(error);
  }
};

const proceedPayment = async (orderId, options) => {
  try {
  } catch (error) {}
};
