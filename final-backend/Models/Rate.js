import mongoose from "mongoose";

const Schema= mongoose.Schema;

const Rate= new Schema({
    value:{
        type:Number,
        required:true,
        min:0,
        max:5
    },
    rated:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    rater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
})

export default mongoose.model("Rate",Rate)