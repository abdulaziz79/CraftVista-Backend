import Category from "../Models/Category.js";

export const createCategory = async (req,res)=>{
    const { title } = req.body
    const image = req.file.path
    try {
        const category = await Category.create({ title, image })
        return res.status(200).json(category)
    } catch (error) {
        return res.status(404).json(error.message)
        console.log(error.message)
    }
}
export const getCategory = async(req, res)=>{
    try {
        const category = await Category.find()
        if(!category){
            return res.status(401).json("not found")
        }
        return res.status(200).json(category)
    } catch (error) {
        return res.status(404).json(error.message)
    }
}

export const getCategoryById= async (req,res)=>{
    const {id} = req.params
    try {
        const category = await Category.findById(id)
        if(category){
            return res.status(200).json(category)
        }
        return res.status(400).json("not found")
    } catch (error) {
        return res.status(404).json(error.message)
    }
}

export const updateCategory = async(req,res)=>{
    const image = req.file.path;
    const {title}= req.body;
    const {id}= req.params;
    try {
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json("Catefory not found");
        }
        if(title) category.title = title;
        if(image) category.image = image;

        const updatedCategory = await category.save()
        return res.status(200).json(updatedCategory)
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export const deleteCategory= async (req, res)=>{
    const {id}= req.params;
    if(!id){
        return res.status(500).json({
            message:"Can't find id"
        })
    }
    try {
        const deletedCategory= await Category.findByIdAndDelete(id)
        if(!deletedCategory){
            return res.status(404).json("Not Found")
        }
        return res.status(200).json({message:"Deleted Successfully", deletedCategory})
    } catch (error) {
        return res.status(404).json(error.message)
    }
}