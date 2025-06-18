import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({path:'./.env'})
console.log(process.env.MONGODB_URI)
const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`/n MongoDb connected : ${connectionInstance}`)
    } catch (error) {
        console.log("Mongodb connection error:",error)
        
    }
}


export default connectDb