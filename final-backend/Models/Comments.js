import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const comentsModelSchema = new mongoose.Schema(
  {

    feedback: {
      type: String,
      required: true,
    },
    userID: {
      index:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        autopopulate: true,

      },
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
        autopopulate: true,

      },
 
  },
  { timestamps: true }
);


comentsModelSchema.plugin(mongooseAutoPopulate);

const comentsSchema = mongoose.model("comentsSchema", comentsModelSchema);

export default comentsSchema; 
