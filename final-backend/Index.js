import  express, { request }  from "express";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import "dotenv/config"
import cors from "cors"
import { login, verifyToken } from "./Middlewares/authentication.js";
import { loggedInUser } from "./Middlewares/authentication.js";
import userRoutes from "./Routes/User.js";
import { connectDB } from "./config/Mongo.js";
import dotenv from "dotenv"
import CategoryRouter from "./Routes/Category.js";
import { logOut } from "./Middlewares/authentication.js";
import postRoutes from "./Routes/Posts.js";
import Rate from "./Routes/Rate.js";
import Review from "./Routes/Review.js";
dotenv.config()


const app=express()
app.use(express.json());

const corsOption={
    origin:"http://localhost:3000",
    credentials:true,
    optionsSuccessStatus:200
}

app.use(cors(corsOption))
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser())

const PORT= process.env.PORT;

app.listen(PORT, (error)=>{
    if(!error) {
        console.log("Server is Running, and App is listening on port "+ PORT) 
    } else {
        console.log("Error: ", error)
    }
})
connectDB()

app.use("/user", userRoutes)
app.use("/logged-in-user", verifyToken, loggedInUser);
app.post('/login', login)
app.post("/logout", logOut);
app.use("/category", CategoryRouter)
app.use("/post", postRoutes)
app.use("/rate", Rate)
app.use("/review", Review)
app.use('/images',express.static('images'))