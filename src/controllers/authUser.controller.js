import { validationResult } from "express-validator";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../lib/apiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ApiKey } from "../models/apikey.model.js";
 
// register new user
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
  const { email, fullName, password,role="user" } = req.body;

  //checking is the user already exists
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(409, "User with the same email already exists!");
  }

  //if the user is not exists then creating a new one
  const newUser = await User.create({
    fullName,
    email,
    password,
    role
  });

  if (!newUser) {
    throw new ApiError(500, "Failed to create new user! Please Try Again.");
  }

  const user = await User.findById(newUser?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(500, "Failed to get new created user's data!");
  }

  // making the response
  const response = new ApiResponse(
    201,
    { user },
    "New user registered successfully"
  );

  //return the response
  return res.status(response.statusCode).json(response);
});

// token generation methods
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    console.log("Got the id her ", userId);
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(500, "Failed to get user data!");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    // console.log(refreshToken)
    // console.log("tokens")
    // console.log(accessToken)
    if (!refreshToken && !accessToken) {
      throw new ApiError(500, "Failed to generate access and refresh tokens!");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
};

//login user
export const loginUser = asyncHandler(async (req, res) => {
  //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "Login validation failed", extractedErrors);
  }

  //get data from front end
  const { email, password } = req.body;

  //find the user
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(500, "User does not exist!");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  console.log("Got the tokens");
  console.log(accessToken);
  console.log(refreshToken);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Failed to get loggedIn user data");
  }

  const response = new ApiResponse(
    200,
    { loggedInUser, accessToken },
    "User loggedIn successfylly"
  );

  return res
    .status(response.statusCode)
    .cookie("accessToken", accessToken, options)
    .json(response);
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  };
  const response = new ApiResponse(200, {}, "User logout successfylly");

  return res
    .status(response.statusCode)
    .clearCookie("accessToken", options)
    .json(response);
});

// change password
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  const response = new ApiResponse(200, {}, "Password changed successfully ");
  return res.status(200).json(response);
});

//get the current user / me
export const getCurrentUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  if (!req.user) {
    throw new ApiError(400, "Failed to get current user");
  }

  const response = new ApiResponse(
    200,
    req.user,
    "current user fetched successfully"
  );
  return res.status(200).json(response);
});

//generateNewAPIKey
export const generateNewAPIKey = asyncHandler(async (req, res) => {
  
    //error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      failed: err.param,
      message: err.msg,
    }));
    throw new ApiError(400, "API key validation failed", extractedErrors);
  }

  
  
    const { name} = req.body;

  const randomString = crypto.randomBytes(32).toString("hex");
  if (!randomString) {
    throw new ApiError("Failed to generate random string!");
  }

  const key = `bookbazaar_${randomString}`;

  const newApiKey = await ApiKey.create({
    name,
    key,
    user: req.user._id,
  });

  const response = new ApiResponse(201,{newApiKey},"New API Key created successfylly")

  return res
        .status(response.statusCode)
        .json(response)


});
