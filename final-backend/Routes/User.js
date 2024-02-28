import express from "express"
import userController from "../Controllers/User.js"
import uploadImage from "../Middlewares/multer.js";
import { verifyToken, checkRole } from "../Middlewares/authentication.js"
import {getAllWorkerss,getByFilter} from "../Controllers/User.js"

const userRoutes= express.Router();

userRoutes.post('/register',uploadImage.single('image'), userController.register);
userRoutes.get('/read/all',  userController.getAllUsers);
userRoutes.get('/read/allWithrates',  getAllWorkerss);

userRoutes.get('/read/allWorker',  userController.getAllWorkers);

userRoutes.get('/read/:id',userController.getUserById);

// userRoutes.put('update/:id', verifyToken, checkRole(["admin"]), userController.updateUserById)
userRoutes.delete('/delete/:id', verifyToken, userController.deleteUserById)
userRoutes.post('/filter',getByFilter)
export default userRoutes