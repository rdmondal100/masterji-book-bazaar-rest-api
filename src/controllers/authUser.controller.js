import { asyncHandler } from "../lib/asyncHandler";


export const registerUser = asyncHandler(async(req,res)=>{
    // get the user details from user
    const {username,email,fullName,password,} = req.body
    
})