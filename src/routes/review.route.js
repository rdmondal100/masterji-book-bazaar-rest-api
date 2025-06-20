import { Router } from "express"
import { addReview, deleteReviewById, getAllReviewsForBook } from "../controllers/review.controller.js"
import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js"
import { validateAddReview, validateDeleteReview, validateGetAllReviewsForBook } from "../validators/review.validate.js"
 
 

const reviewRouter = Router()




//public routes
reviewRouter.route("/books/:bookId").post(checkIsAuthenticated,validateAddReview(),addReview)
reviewRouter.route("/books/:bookId").get(checkIsAuthenticated,validateGetAllReviewsForBook(),getAllReviewsForBook)
reviewRouter.route("/:id").delete(checkIsAuthenticated,validateDeleteReview(),deleteReviewById)
 


export default reviewRouter