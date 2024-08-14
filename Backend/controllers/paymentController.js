import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.js";
import { config } from "dotenv";
config()

export const getRazorpayKEY = async (req,res,next)=>{
    res.status(200).json({
        success: true,
        message: 'Razarpay API key',
        key: process.env.RAZORPAY_KEY_ID
    })
};
export const buySubscription = async (req,res,next)=>{
    const {id} = req.user;
    const user = await User.findById(id);

    if(!user) {
        return next(new AppError('unautherized',400))
    }
    if(user.role === 'ADMIN'){
        return next(new AppError('Admin cant purchage',400))
    }
    try {
        
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1
        });
        
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Subscribed Successfully',
            subscription_id: subscription.id
        })
    } catch (error) {
        return next(new AppError(error.message,400))
    }
};
export const verifySubscription = async (req,res,next)=>{
    const {id} = req.user;
    const {payment_id,signature,subscription_id} = red.body;
    const user = await User.findById(id);

    if(!user) {
        return next(new AppError('unautherized',400))
    }
    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${payment_id}|${subscriptionId}`)
        .digest('hex');

    if(generatedSignature !== signature){
        return next(
            new AppError('payment not verified',500)
        )
    }
    await Payment.create({
        payment_id,
        signature,
        subscription_id
    })
    user.subscription.status = 'active';
    await user.save();
    res.status(200).json({
        success: true,
        message: 'payment verified Successfully',
    })
};
export const cancelSubscription = async (req,res,next)=>{
    const {id} = req.user;
    const user = await User.findById(id);

    if(!user) {
        return next(new AppError('unautherized',400))
    }
    if(user.role == 'ADMIN'){
        return next(new AppError('Admins are not allowed',400))
    }

    const subscriptionId = user.subscription.id;
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;
    await user.save();
};
export const allPayments = async (req,res,next)=>{
    const {count} = req.query;

    const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
    });
    res.status(200).json({
        success: true,
        message: 'All payments',
        subscriptions
    })
};