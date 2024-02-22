import express from "express"
import { createRate,getRateForUser } from "../Controllers/Rate.js"

const Rate = express.Router();

Rate.post("/create", createRate);
Rate.get("/rateForUser/:id", getRateForUser);


export default Rate