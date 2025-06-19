import { Router } from "express";
import { changeCurrentPassword, generateNewAPIKey, getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/authUser.controller.js";
import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js";
import { rateLimiter } from "../lib/utils.js";
import { userLoginValidator, userRegisterValidator } from "../validators/authUser.validate.js";



const authUserRouter = Router()




//public routes
authUserRouter.route("/register").post(userRegisterValidator(),registerUser)
authUserRouter.route("/login").post(userLoginValidator(),loginUser)

//authenticated routes
authUserRouter.route("/logout").post(checkIsAuthenticated,logoutUser)
authUserRouter.route("/change-password").patch(checkIsAuthenticated,rateLimiter(5, 15 * 60 * 1000),changeCurrentPassword)
authUserRouter.route("/me").get(checkIsAuthenticated,getCurrentUser)
authUserRouter.route("/api-key").post(checkIsAuthenticated,generateNewAPIKey)



export default authUserRouter