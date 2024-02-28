import User from "../Models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Rate from "../Models/Rate.js";


export const userController={
    register:async(req,res)=>{
        const {name, email, password, location, phone, selectedCategory}=req.body;
        const image = req.file?.path
        const isWorker = req.body.isWorker === 'true'; 
        console.log(req.body)


        try {
            if (!password || typeof password !== 'string' || password.trim().length < 6){
                return res.status(400).json({ error: "Invalid password in the request body" });
            }
            const existingUser= await User.findOne({email});
            if(existingUser){
                return res.status(401).json({ error: "Email already exists" });
            }
            const salt = 10;
            const hashedPass= await bcrypt.hash(password, salt);
            const newUser= new User({
                name,
                email,
                role: isWorker ? "worker" : "user",
                image:image || null,
                location:location ||  null,
                phone:phone || null,
                categoryId: selectedCategory || null,
                password:hashedPass
            })
            await newUser.save()
            const isSecure= process.env.NODE_ENV === "production"
            // console.log("SECRET_TOKEN:", process.env.SECRET_TOKEN);
            const token = jwt.sign({ userId:newUser._id, role: newUser.role, email:newUser.email, name:newUser.name ,location:newUser.location,image:newUser.image,phone:newUser.phone,categoryId:newUser.categoryId,},process.env.SECRET_KEY, { expiresIn: '24h' })
            res.cookie("token", token, { httpOnly: true, secure:isSecure, sameSite: 'None'});

            res.status(201).json(newUser)

        } catch (error) {
            console.log(error.message)
            res.status(500).json(error.message)
        }
    },

    getAllUsers: async (req, res) => {
        try {
          const allUsers = await User.find();
          res.status(200).json(allUsers);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
      getAllWorkers: async (req, res) => {
        try {
          const allUsers = await User.find({role:"worker"}).populate("categoryId");
          res.status(200).json(allUsers);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

      getUserById: async (req, res) => {
        try {
          const user = await User.findById(req.params.id);
          if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
          }
          const averageRate = await getAverageRateForUser(user._id);
          const userWithRate = {...user.toJSON() , averageRate : averageRate.averageRating , number : averageRate.totalRatings }
          res.status(200).json(userWithRate);
        } catch (error) {
          res.status(500).json({ message: "key one" + error.message });
        }
      },

      deleteUserById: async (req, res) => {
        try {
          const deletedUser = await User.findByIdAndDelete(req.params.id);
          if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
          }
          res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
}

const getAverageRateForUser = async (userId) => {
  try {
      const averageRatingg = await Rate.aggregate([
          {
              $match: { rated: userId } 
          },
          {
              $group: {
                  _id: null,
                  averageRating: { $avg: { $toDouble: "$value" } },
                  totalRatings: { $sum: 1 } // Count the number of ratings

              }
          }
      ]);      
      
      if (averageRatingg.length > 0) {
        const { averageRating, totalRatings } = averageRatingg[0];
        return { averageRating: averageRating.toFixed(1), totalRatings };      } 
        else {
          return { averageRating: 0, totalRatings: 0 }; // If no ratings found for the user
        }
  } catch (error) {
      throw new Error(error.message);
  }
}

export const getAllWorkerss = async (req, res) => {
  try {
      const allUsers = await User.find({ role: "worker" }).populate("categoryId");
      
      // Fetch average rate for each user
      const usersWithAverageRate = await Promise.all(allUsers.map(async (user) => {
          const averageRate = await getAverageRateForUser(user._id);
          return { ...user.toJSON(),rate: averageRate.averageRating,number:averageRate.totalRatings };
      }));
      
      res.status(200).json(usersWithAverageRate);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


export default userController;

export const getByFilter = async (req, res) => {
  const { category, location } = req.query; // Accessing query parameters
  console.log(req.query); // Logging query parameters for debugging
  
  const filterBy = {};
  
  if (category) {
    filterBy.categoryId = category;
  }
  
  if (location) {
    filterBy.location = { $regex: new RegExp(location, 'i') };
  }
  
  try {
    const users = await User.find(filterBy);
    if (users.length > 0) { // Check if users array is not empty
      return res.status(200).json(users);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
