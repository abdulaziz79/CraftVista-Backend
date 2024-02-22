import Rate from "../Models/Rate.js";
import User from "../Models/User.js";
import mongoose from "mongoose";
// Create rate
export const createRate = async (req, res) => {
    const { rated, rater, value } = req.body;
    console.log(req.body)
    try {
        const rateExist=await Rate.findOne({rated:rated,rater:rater})
        if(rateExist){
            rateExist.value=value
            await rateExist.save()
            return res.status(200).json(rateExist);
        }
        else{
            const newRate = new Rate({
                rated,
                rater,
                value
            });
            const savedRate = await newRate.save();
            return res.status(200).json(savedRate);
        }
      
    } catch (error) {
        return res.status(501).json(error.message);
    }
}

export const getRate = async(req,res)=>{
    try {
        const rate = await Rate.find()
        if(rate){
            res.status(200).json(rate)
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const getRateForUser = async(req,res)=>{
    const {id} = req.params
    try {
        const averageRating = await Rate.aggregate([
            {
                $match: { rated: new mongoose.Types.ObjectId(id)} 
            },

            {
                $group: {
                    _id: null,
                    averageRating: { $avg: { $toDouble: "$value" } } ,
                    totalRatings: { $sum: 1 } // Count the number of ratings

                }
            }
        ]);      

          if(averageRating){
            let averageRate=averageRating[0]
            averageRate.averageRating=averageRate.averageRating.toFixed(1)
            res.status(200).json({average:Number(averageRate.averageRating),number:averageRate.totalRatings})
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}


// export const getRateById = async(req,res)=>{
//     const { id } =req.params
//     try {
//         const rate = await Rate.findById(id)
//         if(rate){
//             res.status(200).json(rate)
//         }
//     } catch (error) {
//         res.status(500).json(error.message)
//     }
// }

// Update rate
export const updateRate = async (req, res) => {
    const { id } = req.params; 
    const { value } = req.body; 
    try {
        
        const rate = await Rate.findById(id);

        if (!rate) {
            return res.status(404).json({ message: "Rate not found" });
        }
        
        rate.value = value;
        const updatedRate = await rate.save();
        return res.status(200).json(updatedRate);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

