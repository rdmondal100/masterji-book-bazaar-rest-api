import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export default Review = mongoose.model("Review",reviewSchema)