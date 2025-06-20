import { Router } from "express"
 import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js"
import { addToCart, createOrder, getAllOrdersForUser, getOrderDetailsById } from "../controllers/order.controller.js"
  
 

const orderRouter = Router()




//public routes
orderRouter.route("/addto-cart").post(checkIsAuthenticated,addToCart)
orderRouter.route("/").post(checkIsAuthenticated,createOrder)
orderRouter.route("/").get(checkIsAuthenticated, getAllOrdersForUser)
orderRouter.route("/:id").get(checkIsAuthenticated,getOrderDetailsById)
 


export default orderRouter