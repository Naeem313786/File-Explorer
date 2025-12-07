const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config();
const PORT=process.env.PORT || 5000;
const MONGOURL=process.env.MONGO_URL || "mongodb://localhost:27017/FileExplorer"

const connectDB=async()=>{
    try {
       await mongoose.connect(MONGOURL) 
       console.log("MongoDB connected Successfully")
    } catch (error) {
        console.log("MongoDB Connection Failed", error)
    }
}
//connectDB();
module.exports=connectDB;
