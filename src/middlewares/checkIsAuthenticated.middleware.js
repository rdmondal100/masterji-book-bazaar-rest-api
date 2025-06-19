import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import { ApiError } from '../lib/apiError.js'
import { asyncHandler } from '../lib/asyncHandler.js'

export const checkIsAuthenticated = asyncHandler(async (req,_,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorzation"?.replace("Bearer",""))
    console.log(token)
    console.log(req.cookies)
 
  
  if(!token){
    throw new ApiError(401,"Unauthorised token")
  }
  
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
     console.log(user)
  
    if(!user){
      throw new ApiError(401, "invalid access Token")
    }
  
    req.user = user
    next()
  } catch (error) {
      throw new ApiError(401,error?.message || "Invalid acess token")
  }

})
