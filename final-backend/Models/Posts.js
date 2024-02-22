import mongoose from "mongoose";

const Schema = mongoose.Schema

const Posts = new Schema({
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:true
    },
    
}
,
{
    timestamps:true
})

export default mongoose.model("Posts" , Posts)