import mongoose, { Schema } from "mongoose";


const apiKeySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default APIKey = mongoose.model("APIKey",apiKeySchema)