import express from "express"
import { createRate,getRateForUser } from "../Controllers/Rate.js"
import { verifyToken } from "../Middlewares/authentication.js";

const Rate = express.Router();

Rate.post("/create",verifyToken, createRate);
Rate.get("/rateForUser/:id", getRateForUser);


export default Rate