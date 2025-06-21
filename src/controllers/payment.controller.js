import { ApiError } from "../lib/apiError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import Razorpay from "razorpay";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { ApiResponse } from "../lib/apiResponse.js";
import crypto from "crypto";
import { sendEmail } from "../lib/email/sendEmail.js";


// i failed to used the real credential as i am from bangladesh and i failed to create the rezorpay account
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

export const createPayment = asyncHandler(async (req, res) => {
  const orderId = req.body.orderId;
  if (!orderId) {
    throw new ApiError(404, "OrderId is required");
  }

  const order = await Order.findById(orderId);
  console.log("Order got")
  console.log(order)
  if (!order) {
    throw new ApiError(404, `Order not found with id ${orderId}`);
  }

  console.log(order.user.toString())
  console.log(req.user._id.toString())
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to pay for this order");
  }

  // Create Razorpay order
//   const razorpayOrder = await razorpay.orders.create({
//     amount: order.totalAmount * 100,
//     currency: "BDT",
//     receipt: `recept-${Date.now()}`,
//     notes: {
//       orderId: order._id.toString(),
//     },
//   });

const razorpayOrder = {
    id: `demo_order_${Date.now()}`,
    amount: order.totalAmount * 100,
    currency: "BDT",
    receipt: `recept-${Date.now()}`,
     notes: {
      orderId: order._id.toString(),
    },
}

  console.log("razorpayOrder")
  console.log(razorpayOrder)
  //create new payment on db
 
  const newPayment = await Payment.create({
    order: order._id,
    amount: order.totalAmount,
    currency: razorpayOrder.currency,
    razorpayPaymentId: razorpayOrder.id,
    receipt: razorpayOrder.receipt,
    status: "created",
  });

  console.log("newPayment")
  console.log(newPayment)

  if (!newPayment) {
    throw new ApiError(500, "Payment record creation failed");
  }

    if (order?.user?.email) {
    await sendEmail("ORDER_PLACED", order.user.email, {
      orderId: order._id.toString(),
    });
  }


  const response = new ApiResponse(201, {
    razorpayOrderId: razorpayOrder.id,
    razorpayPaymentId: newPayment._id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    receipt: razorpayOrder.receipt,
    dbOrderId: order._id,
  },"Payment created successfylly. You will get an email soon. NOTE: this mail will go to the mailtrap not to your inbox as it is a demo");

  return res.status(response.statusCode).json(response);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id } =
    req.body;

//   const generatedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

  if (!razorpay_order_id || !razorpay_payment_id) {
    throw new ApiError(400, "Both order and payment IDs are required");
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayPaymentId: razorpay_order_id },
    { status: "captured" },
        { new: true }

  );
  if (!payment) {
    throw new ApiError(404, "Payment not found to update");
  }

  const order = await Order.findByIdAndUpdate(
    payment.order,
    { status: "processing", paymentId: razorpay_payment_id },
    { new: true }
  ).populate("user");

  console.log(order);
  if (order?.user?.email) {
    await sendEmail("ORDER_CONFIRMED", order.user.email, {
      orderId: order._id.toString(),
    });
  }

  const response = new ApiResponse(
    200,
    {},
    "Payment verified and order confirmed.You will get an email soon. NOTE: this mail will go to the mailtrap not to your inbox as it is a demo"
  );
  res.status(200).json(response);
});
