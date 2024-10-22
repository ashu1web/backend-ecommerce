import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        required:[true,'category is required']
    },
   
},{timestamps:true})



export const categorytModel=mongoose.model("Category",categorySchema)
export default categorytModel