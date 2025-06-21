import { Router } from "express"
 import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js"
import { addToCart, createOrder, getAllOrdersForUser, getOrderDetailsById } from "../controllers/order.controller.js"
import { verifyApiKey } from "../middlewares/verifyApiKey.middleware.js"
  
 

const orderRouter = Router()




//public routes
orderRouter.route("/addto-cart").post(checkIsAuthenticated,verifyApiKey,addToCart)
orderRouter.route("/").post(checkIsAuthenticated,verifyApiKey,createOrder)
orderRouter.route("/").get(checkIsAuthenticated,verifyApiKey, getAllOrdersForUser)
orderRouter.route("/:id").get(checkIsAuthenticated,verifyApiKey,getOrderDetailsById)
 


export default orderRouter