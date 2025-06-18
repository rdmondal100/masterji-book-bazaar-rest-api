import { Router } from "express";
import { registerUser } from "../controllers/authUser.controller.js";



const authUserRouter = Router()




//routes
authUserRouter.route("/register").post(registerUser)




export default authUserRouter