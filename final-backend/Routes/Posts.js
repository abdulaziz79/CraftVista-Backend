import  express from "express";
import { createPost, getAllUserPosts, getAllWorkerPosts, getAllPosts, getByUserId } from "../Controllers/Posts.js";

const postRoutes = express.Router();

postRoutes.post("/create", createPost)
postRoutes.get("/readUserPosts", getAllUserPosts)
postRoutes.get("/readWorkerPosts", getAllWorkerPosts)
postRoutes.get("/readPosts", getAllPosts)
postRoutes.get("/readPosts/:id", getByUserId)




export default postRoutes