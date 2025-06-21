import mongoose, { Schema, Types } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index:true
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    apiKey:{
      type: Schema.Types.ObjectId,
      ref: "APIKey"
    }

  },
  { timestamps: true }
);

//if password changed then again has it and then save
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next()
    }

    this.password = await bcrypt.hash(this.password,10)
    next()
})


//function to check the password correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}


//function to generate the accesstoken
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


//function to generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.REFRESH_TOCKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOCKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);
