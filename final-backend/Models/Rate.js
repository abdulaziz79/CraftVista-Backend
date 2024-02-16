import mongoose from "mongoose";

const Schema= mongoose.Schema;

const Rate= new Schema({
    value:{
        type:Number,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
})

export default mongoose.model("Rate",Rate)