import mongoose from "mongoose";

const paymentSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "BDT",
  },
  razorpayPaymentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["created", "captured", "failed"],
    default: "created",
  },
  receipt: String,
}, { timestamps: true });



export default Payment = mongoose.model("Payment",paymentSchema)