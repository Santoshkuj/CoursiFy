import User from "../models/userModel.js";
import AppError from "../utils/error.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

const cookieOption = {
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
    secure: true
}

const register = async (req,res,next) => {

    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password) {
        return next(new AppError('All fields are required',400))
    }
    const userExists = await User.findOne({email});
    if(userExists) {
        return next(new AppError('Email already exists',400))
    }
   const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
        public_id: email,
        secure_url: ""
    }
   }) 
   if(!user){
    return next(new AppError('user registration failed, please try again',400))
   }

   if(req.file){
    try {
     const result =await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'Backend',
        width: 250,
        height:250,
        gravity: 'face',
        crop: 'fill'
     });
     if(result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`)
     };
    } catch (e) {
        return next(new AppError(e || 'File not uploaded',500))
    }
   }

   await user.save();
   user.password = undefined;

   const token = await user.generateJWTToken()
   res.cookie('token',token,cookieOption)
   res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user
   })

};

const login =async (req,res,next) => {
    try {
        const {email, password} =req.body;
        if(!email || !password) {
            return next(new AppError('all fields are required',400));
        }
        const user = await User.findOne({
            email
        }).select('+password');
    
        if(!user || !user.comparePassword(password)){
            return next(new AppError('Email or password dose not match',400))
        }
    
        const token = await user.generateJWTToken()
        user.password = undefined;
        
        res.cookie('token',token,cookieOption);
    
        res.status(200).json({
            success: true,
            message: "User loggedin succesfully",
            user
        });
    } catch (e) {
        return next(new AppError(e.message,500))
    }
};

const logout = (req,res) => {
    res.cookie('token',null,{
        secure: true,
        maxAge: 0,
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'User loggout succesfully'
    })
};
const getProfile =async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        res.status(200).json({
            success:true,
            message: 'User details',
            user
        });
    } catch (e) {
        return next(new AppError('Failed to fetch profile'),500)
    }
};

const forgotPassword =async (req,res,next)=>{
    const {email} = req.body;

    if(!email){
        return next(new AppError('Email is required',400));
    }
    const user = await User.findOne({email});
    if(!user) {
        return next(new AppError('Email not registered',400));
    }
    const resetToken = await user.generatePasswordResetToken();
    await user.save;

    const resetPasswordURL = `${process.env.FRONTEND_URL},/reset-password/${resetToken}`;
    const subject = 'Reset password';
    const message = `you can reset your password by clicking ${resetPasswordURL}`
    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${resetToken}`
        })
    } catch (e) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();
        return next(new AppError(e.message,500));
    }
}

const resetPassword =async (req,res,next) =>{
    const {resetToken} = req.params;

    const {password} = req.body;
    const forgotPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt: Date.now()}
    });
    if(!user) {
        return next(new AppError('Token is invalid or expired',400))
    }
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed succesfully'
    })
}

const changePassword = async(req,res,next)=> {
    const {oldPassword, newPassword} = req.body;
    const{id} = req.user;
    if(!oldPassword || !newPassword) {
        return next(new AppError('All fields are required',400))
    }
    const user = await User.findById(id).select('+password');
    if(!user) {
        return next(new AppError('User dose not exists',400))
    };
    const isPasswordValid = await user.comparePassword(oldPassword);
    if(!isPasswordValid) {
        return next(new AppError('Old password dose not match',400))
    };
    user.password = newPassword;
    await user.save();
    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'password changed successfully'
    })
}

const updateUser =async (req,res,next)=> {
    const {fullName} = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if(!user) {
        return next(new AppError('User dose not exists',400))
    };
    if(fullName) {
        user.fullName = fullName;
    }
    if(req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            const result =await cloudinary.v2.uploader.upload(req.file.path,{
               folder:'Backend',
               width: 250,
               height:250,
               gravity: 'face',
               crop: 'fill'
            });
            if(result) {
               user.avatar.public_id = result.public_id;
               user.avatar.secure_url = result.secure_url;
       
               fs.rm(`uploads/${req.file.filename}`)
            };
           } catch (e) {
               return next(new AppError(error || 'File not uploaded',500))
           }
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: 'user details updated successfully'
        })
    }

    const getUserStats = async (req,res,next)=>{
        try {
            const [allUserCount, subscribedCount] = await Promise.all([
                User.countDocuments({}),
                User.countDocuments({ 'subscription.status': 'active' })
            ]);
            const data = {allUserCount, subscribedCount}
            res.status(200).json({ 
                success : true,
                message : 'Successfully fetched user stats',
                data
            });
        } catch (error) {
            return(next(new AppError("Failed to load stats",400)))
        }

    }

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser,
    getUserStats
}