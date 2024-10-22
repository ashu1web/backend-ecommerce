import JWT from "jsonwebtoken";
import userModel from '../models/userModel.js'
export const isAuth=async(req,res,next)=>{
       const {token}=req.cookies
       //validation
       if(!token){
          res.status(401).send({
            success:false,
            message:'UnAuthorized User'
          })
       }
      const decodeData=JWT.verify(token,process.env.JWT_SECRET)
        // Attach the user ID to req.user
      req.user=await userModel.findById(decodeData._id)
      next()
}

// ADMIN AUTH
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "admin only",
    });
  }
  next();
};