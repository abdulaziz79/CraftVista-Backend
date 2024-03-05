import  express from "express";
import uploadImage from "../Middlewares/multer.js";
import { createPost, getAllUserPosts, getAllWorkerPosts, getAllPosts, getByUserId , deletePostById, getByFilter} from "../Controllers/Posts.js";
import { verifyToken } from "../Middlewares/authentication.js";

const postRoutes = express.Router();

postRoutes.post("/create", verifyToken, uploadImage.single("image"), createPost)
postRoutes.get("/readUserPosts", getAllUserPosts)
postRoutes.get("/readWorkerPosts", getAllWorkerPosts)
postRoutes.get("/readPosts", getAllPosts)
postRoutes.get("/readPosts/:id", getByUserId)
postRoutes.post("/filter", getByFilter)
postRoutes.delete("/delete/:id", deletePostById)





export default postRoutes