import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        // const myUrl = new URL(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // const connectionInstance = await mongoose.connect(myUrl.toString())
        console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected ! DB host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongoDB connection error", error);
        process.exit(1)
    }
}

export default connectDB