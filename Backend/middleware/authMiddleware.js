import User from "../models/userModel.js";
import AppError from "../utils/error.js";
import JWT from 'jsonwebtoken'

const isLoggedIn =async (req,res,next) =>{
    const {token} = req.cookies;
    if(!token){
        return new AppError('Unauthenticated',400)
    }
    const userDetails = await JWT.verify(token,process.env.JWT_SECRET);
    req.user = userDetails;
    next()
};

const authorizeRoles = (...roles)=>async(req,res,next) =>{
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)) {
        return next(new AppError('you dont have permission'))
    }
    next();
}
const authorizeSub = async(req,res,next)=>{
    const user =await User.findById(req.user.id)

    if(user.role !== 'ADMIN' && user.subscription.status !== 'active'){
        return next(new AppError('subscribe to access',403))
    }
    next();
}
export {isLoggedIn,authorizeRoles,authorizeSub}