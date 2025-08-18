import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`database connected  ${conn.connection.host}`);
    }
    catch (error) {
        console.log(process.env.MONGO_URI)
        console.log(`error connected to your database is ${error}`)
        process.exit(1); //exits with failure
    }
} 


