// import e from "express";
import Posts from "../Models/Posts.js";
import User from "../Models/User.js";
import mongoose from "mongoose";

import Category from "../Models/Category.js"; // Import the Category model


export const createPost = async (req, res) => {
  console.log(req.body)
  console.log("userrrr",req.user.userId)
    try {
      const { userId,description, location, categoryId } = req.body;
  

  let img=null;
      if(req.file){
img=req.file.path
      }
      const newPost = new Posts({
        description,
        image: img,
        location,
        userId:req.user.userId,
        categoryId
      })
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
      const workerPosts = await Posts.find({ userId: { $in: workerUserIds } }).sort({createdAt:-1}).populate("userId");
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
      const userPosts = await Posts.find({userId: {$in: usersUserId}}).sort({createdAt:-1}).populate(["userId", "categoryId"])
      res.json(userPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };

     
  export const getByUserId = async (req, res) => {
    const id=req.params.id
    try {
      const userPosts= await Posts.find({userId: id}).sort({createdAt:-1}).populate("categoryId")
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
      const users= await Posts.find().sort({createdAt:-1}).populate(["userId","categoryId"])
      if(users){
        res.status(200).json(users)
      }
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
  
 
export const getByFilter = async (req, res) => {
  const { category, location, role } = req.query;
  try {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $match: {
          "user.role": role
        }
      }
    ];

    // Optionally add $match stage based on categoryId if provided
    if (category) {
      pipeline.push({
        $match: {
          "category._id": new mongoose.Types.ObjectId(category)
        }
      });
    }

    // Optionally add additional $match stage based on location
    if (location) {
      pipeline.push({
        $match: {
          location: location
        }
      });
    }

    const posts = await Posts.aggregate(pipeline).sort({createdAt:-1});
    if (posts) {
      return res.status(200).json(posts);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};