import e from "express";
import Posts from "../Models/Posts.js";
import User from "../Models/User.js";

export const createPost = async (req, res) => {
    try {
      const { userId,description, location, categoryId } = req.body;
  

      // const user = await User.findById(userId);

      // if (!user) {
      //   return res.status(404).json({ message: 'User not found' });
      // }
  
      const newPost = new Posts({
        description,
        image:req.file.path,
        location,
        userId,
        categoryId
      });
        const savedPost = await newPost.save();

      res.status(201).json(savedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };  

  export const getAllWorkerPosts = async (req, res) => {
    try {
 
      const workers = await User.find({ role: 'worker' });
      const workerUserIds = workers.map(worker => worker._id);
      const workerPosts = await Posts.find({ userId: { $in: workerUserIds } }).populate("userId");
      console.log(workerPosts)
   return   res.json(workerPosts);
    } catch (error) {
      console.error(error);
     return res.status(500).json(error.message);
    }
  };
  
   
  export const getAllUserPosts = async (req, res) => {
    try {
      const users= await User.find({role: "user"})
      const usersUserId = users.map(user=> user._id)
      const userPosts = await Posts.find({userId: {$in: usersUserId}}).populate("userId")
      res.json(userPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };

     
  export const getByUserId = async (req, res) => {
    const id=req.params.id
    try {
      const userPosts= await Posts.find({userId: id}).populate("categoryId")
      // const usersUserId = users.map(user=> user._id)
      // const userPosts = await Posts.find({userId: {$in: usersUserId}}).populate("userId")
      res.json(userPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };

  export const getAllPosts = async (req, res)=>{
    try {
      const users= await Posts.find()
      res.status(200).json(users)
    } catch (error) {
      res.status(404).json(error.message)
    }
  }

  export const deletePostById = async(req, res)=>{
    const { id } = req.params
    try {
      const deletedPost = await Posts.findByIdAndDelete(id)
      if(!deletedPost){
        return res.status(404).json("post not found")

      }
      res.status(200).json(deletedPost)
    } catch (error) {
      res.status(400).json(error.message)
    }
  }
  
  export const updatePostById= async(req,res)=>{
   const { id } = req.params;
   const {description, location, categoryId } = req.body;
   const image = req.path.file;

   try {
    const updatedPost = await Posts.findById(id);

    if(!updatedPost){
      return res.status(404).json("Not Found")
    }

    if(description) updatedPost.description = description
    if(location) updatedPost.location = location
    if(categoryId) updatedPost.categoryId = categoryId
    if(image) updatedPost.image = image


    await updatedPost.save()
    return res.status(200).json(updatedPost)

   } catch (error) {
    res.status(404).json(error.message)
   }
  }
  