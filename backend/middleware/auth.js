import jwt from "jsonwebtoken";
import User from "../model/user.js";




 export const protectroutes= async (req,res,next)=>{
    try {
        const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({message:"Token not provided"});
        }
        const decoded = jwt.verify(token,"kun123");
        const user = await User.findById(decoded.userid).select("-password");
        if(!user){
            return res.status(401).json({message:"Unauthorized access"});
        }
        req.user=user;
        next();
    }
    catch (error) {
        console.error("Error in protectroutes middleware:", error);
        res.status(401).json({message:error.message});
    }
 }