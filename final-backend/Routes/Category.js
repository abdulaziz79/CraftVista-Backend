import  express  from "express";
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from "../Controllers/Category.js";
import uploadImage from "../Middlewares/multer.js"

const CategoryRouter = express.Router()

CategoryRouter.post("/add",uploadImage.single("image"), createCategory )
CategoryRouter.get("/read", getCategory)
CategoryRouter.get("/readById/:id", getCategoryById)
CategoryRouter.put("/update/:id", updateCategory)
CategoryRouter.delete("/delete/:id",deleteCategory)

export default CategoryRouter