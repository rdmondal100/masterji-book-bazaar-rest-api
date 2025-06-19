import { Router } from "express"
import { checkIsAdmin } from "../middlewares/checkIsAdmin.middleware.js"
import { addBooks, getAllBooks, getBookDetailsById, updateBookDetailsById,deleteBookById } from "../controllers/books.controller.js"
import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js"
import { addBookValidator, getBooksValidator, updateBookValidator } from "../validators/book.validate.js"

 

const bookRouter = Router()




//public routes
bookRouter.route("/").post(checkIsAuthenticated,checkIsAdmin,addBookValidator(),addBooks)
bookRouter.route("/").get(checkIsAuthenticated,getBooksValidator(),getAllBooks)
bookRouter.route("/:id").get(checkIsAuthenticated,getBookDetailsById)
bookRouter.route("/:id").put(checkIsAuthenticated,checkIsAdmin,updateBookValidator(),updateBookDetailsById)
bookRouter.route("/:id").delete(checkIsAuthenticated,checkIsAdmin,deleteBookById)
 


export default bookRouter