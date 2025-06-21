import { Router } from "express"
 import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js"
import { createPayment, verifyPayment } from "../controllers/payment.controller.js"
import { verifyApiKey } from "../middlewares/verifyApiKey.middleware.js"
  
 

const paymentRouter = Router()




paymentRouter.route("/create").post(checkIsAuthenticated,verifyApiKey,createPayment)
paymentRouter.route("/verify").post(checkIsAuthenticated,verifyApiKey,verifyPayment)
 

export default paymentRouter