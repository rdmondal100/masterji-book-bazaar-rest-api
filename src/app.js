import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authUserRouter from "./routes/authUser.route.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";
import bookRouter from "./routes/book.route.js";
import reviewRouter from "./routes/review.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Response from the backend successfull")
})



//routes 
app.use("/api/v1/auth",authUserRouter)
app.use("/api/v1/books",bookRouter)
app.use("/api/v1/reviews",reviewRouter)

//global error handler
app.use(globalErrorHandler);

export default app