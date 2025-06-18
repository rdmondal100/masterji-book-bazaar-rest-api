import dotenv from 'dotenv';
dotenv.config({path:'./.env'})

import connectDb from './db/connectDb.js';
import app from './app.js';
  


connectDb()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error: ",error)
        throw error
    })

    app.listen(process.env.PORT || 5555,()=>{
        console.log(`http://localhost:${process.env.PORT}`)
    })

})

.catch((error)=>{
    console.log("DB connection failed:: ",error)
})