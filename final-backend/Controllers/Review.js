// import Review from "../models/ReviewModel.js";
import comentsSchema from "../Models/Comments.js";
// Get all coments
export const getAllComments = async (req, res) => {
  try {
    const comments = await comentsSchema.find().sort({ createdAt: -1 });
    res.status(201).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getReviewById = async(req,res)=>{
    const { id } =req.params;
    try {
        const review = await comentsSchema.findById(id)
        if(!review){
          return  res.status(401).json("Not Found")
        }
        res.status(201).json(review)
    } catch (error) {
        res.status(404).json(error.message)
    }
}
// Add A coments
export const addcoments = async (req, res) => {
  const { feedback, userID,postId } = req.body;
  console.log("Received data:", { feedback, userID,postId });

  try {
    if (!feedback || !userID|| !postId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Logging MongoDB query
    console.log("Inserting document into MongoDB...");
    const newComment = await comentsSchema.create({
      feedback,
      userID,
      postId,
    });

    console.log("Document inserted successfully:", newComment);
    return res.status(200).json(newComment);
  } catch (error) {
    console.log("Error occurred:", error);
    return res.status(500).json(error.message);
  }
};


// Update an coments
export const updatecoments = async (req, res) => {
  const id = req.params.id;
  const {  feedback,userID} = req.body;

  try {
    const existingTestimoniol = await comentsSchema.findById(id);
    if (!existingTestimoniol) {
      return res.status(404).json({ error: "coments not found" });
    }

    if ( feedback) existingTestimoniol.feedback =  feedback;
    if ( userID) existingTestimoniol.userID =  userID;

    const updatedcoments = await existingTestimoniol.save();

    return res.status(200).json(updatedcoments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Delete an coments
export const deletecoments = async (req, res) => {
    const id = req.params.id;
    try {
      const existingTestimoniol = await comentsSchema.findById(id);
  
      if (!existingTestimoniol) {
        return res.status(404).json({ error: "coments not found" });
      }
  
      await comentsSchema.deleteOne({ _id: id });
  
      res.status(200).json({ message: "coments deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };