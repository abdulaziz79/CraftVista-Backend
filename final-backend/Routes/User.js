import express from "express"
import userController from "../Controllers/User.js"
import uploadImage from "../Middlewares/multer.js";
import { verifyToken, checkRole } from "../Middlewares/authentication.js"

const userRoutes= express.Router();

userRoutes.post('/register',uploadImage.single('image'), userController.register);
userRoutes.get('/read/all',  userController.getAllUsers);
userRoutes.get('/read/allWorker',  userController.getAllWorkers);

userRoutes.get('/read/:id', verifyToken, checkRole(["admin"]),userController.getUserById);

// userRoutes.put('update/:id', verifyToken, checkRole(["admin"]), userController.updateUserById)
userRoutes.delete('/delete/:id', verifyToken, userController.deleteUserById)

export default userRoutes