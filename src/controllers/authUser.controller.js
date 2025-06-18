import { validationResult } from "express-validator";
import { asyncHandler } from "../lib/asyncHandler";
import { ApiError } from "../lib/apiError";
import { User } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Register validation failed", extractedErrors);
  }

  // get the user details from user
  const { email, fullName, password } = req.body;

  //checking is the user already exists
  const existingUser = await User.findOne({
    email,
  });
});
