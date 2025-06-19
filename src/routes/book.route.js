import { Router } from "express"

 

const bookRouter = Router()




//public routes
bookRouter.route("/books").post(userRegisterValidator(),registerUser)
 


export default bookRouter