import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const apiKeySchema = new Schema({
  name:{
    type: String,
    required: true,
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"]

  },
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
  usageLimit: {
    type: Number,
    min: [1, "Usage limit must be at least 1"],
    default: 1000
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
},{
  timestamps: true
});

export const APIKey = mongoose.model("APIKey", apiKeySchema);
