import { Router } from "express"
import { checkIsAdmin } from "../middlewares/checkIsAdmin.middleware.js"
import { addBooks, getAllBooks, getBookDetailsById, updateBookDetailsById,deleteBookById } from "../controllers/books.controller.js"
import { checkIsAuthenticated } from "../middlewares/checkIsAuthenticated.middleware.js"
import { addBookValidator, getBooksValidator, updateBookValidator } from "../validators/book.validate.js"
import { verifyApiKey } from "../middlewares/verifyApiKey.middleware.js"

 

const bookRouter = Router()




//public routes
bookRouter.route("/").post(checkIsAuthenticated,checkIsAdmin,verifyApiKey,addBookValidator(),addBooks)
bookRouter.route("/").get(checkIsAuthenticated,verifyApiKey,getBooksValidator(),getAllBooks)
bookRouter.route("/:id").get(checkIsAuthenticated,verifyApiKey,getBookDetailsById)
bookRouter.route("/:id").put(checkIsAuthenticated,checkIsAdmin,verifyApiKey,updateBookValidator(),updateBookDetailsById)
bookRouter.route("/:id").delete(checkIsAuthenticated,checkIsAdmin,verifyApiKey,deleteBookById)
 


export default bookRouter