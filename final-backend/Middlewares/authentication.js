import jwt from "jsonwebtoken";
import  dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt"
import User from "../Models/User.js";

export const verifyToken= (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error: "Unauthorized or Missing token"})
    }
    try {
        // console.log("SECRET_TOKEN:", process.env.SECRET_KEY);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded Token:", decoded);

        req.user = decoded;
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).json(error.message)
    }
}

//checkk role

export const checkRole = (roles)=>{
    return (req,res, next)=>{
        try {
            if(roles.includes(req.user.role)){
                next();
            }else{
                return res.status(500).send("Access denied. you don't have permission")
            }
        } catch (error) {
            return res.status(404).json({error:404, message:"Not authorized"})
        }
    }
}

//login
export const login=async(req, res)=>{
    const {email, password}=req.body;
    try {
        if(!email || !password){
            return res.status(400).json("all fields are required")
        }
        const user= await User.findOne({email})
        if(!user){
            return res.status(401).json("Invalid Email")
        }
        const isValidPassword= await bcrypt.compare(password, user.password)

        if(!isValidPassword){
            return res.status(401).json("Invalid Password")
        }
        const token= jwt.sign(
            {_id: user._id, role: user.role, email, name:user.name},
            process.env.SECRET_KEY,
            {expiresIn:"24h"}
        )

        return res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            sameSite:"None"
        }).status(200).json({ message: "Login successful", data: user , token});

    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
}

// This is just to check if the user if Authorized or not
export const authenticateUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  export const loggedInUser = (req, res) => {
    return res.json({ user: req.user }).status(200);
  };

  export const logOut = (req, res) => {
    return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Successfully Logged Out!" });
  };
  