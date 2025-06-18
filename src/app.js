import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authUserRouter from "./routes/authUser.route.js";

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
app.use("/api/v1/user",authUserRouter)

export default app