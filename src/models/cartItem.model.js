import mongoose from "mongoose";

const cartItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { timestamps: true });


export default CartItem = mongoose.model("CartItem",cartItemSchema)
