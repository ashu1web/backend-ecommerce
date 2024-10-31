import mongoose from 'mongoose'
import mongo from 'mongoose'
 
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongoose Connected ${mongoose.connection.host}`)    
    }catch(error){
        console.loh(`Mongoose Error ${error}`)
    }
}
export default connectDB;
