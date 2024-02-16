import mongoose from "mongoose"

const Schema= mongoose.Schema;

const User= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    location:{
        type:String
    },
    image:{
        type:String
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    role:{
        type:String,
        enum:['user', 'admin','worker'],
        default:'user'
    }
})

export default mongoose.model("User", User)