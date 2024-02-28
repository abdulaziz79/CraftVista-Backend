import express from "express"
import { addcoments, getAllComments, getReviewById } from "../Controllers/Review.js"

const Review = express.Router()

Review.post('/create',addcoments)
Review.get('/read',getAllComments)
Review.get('/getById/:id',getReviewById)

export default Review