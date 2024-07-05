import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"
// const connectDb = asyncHandler( async (req, res, next) => {
//     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     console.log("Connected Succcessfully \n", connectionInstance)
// })

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Database Connected Succesfully: ", connectionInstance.connection.host);
    } catch (error) {
        console.error("Failed to connect",error);
    }
}

export {connectDb}