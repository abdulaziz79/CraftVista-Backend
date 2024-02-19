import  express from "express";
import uploadImage from "../Middlewares/multer.js";
import { createPost, getAllUserPosts, getAllWorkerPosts, getAllPosts, getByUserId , deletePostById} from "../Controllers/Posts.js";

const postRoutes = express.Router();

postRoutes.post("/create", uploadImage.single("image"), createPost)
postRoutes.get("/readUserPosts", getAllUserPosts)
postRoutes.get("/readWorkerPosts", getAllWorkerPosts)
postRoutes.get("/readPosts", getAllPosts)
postRoutes.get("/readPosts/:id", getByUserId)
postRoutes.delete("/delete/:id", deletePostById)





export default postRoutes