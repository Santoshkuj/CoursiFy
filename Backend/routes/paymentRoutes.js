import { Router } from "express";
import { allPayments, buySubscription, cancelSubscription, getRazorpayKEY, verifySubscription } from "../controllers/paymentController.js";
import { authorizeRoles, authorizeSub, isLoggedIn } from "../middleware/authMiddleware.js";

const router = Router();

router
    .route('/razorpay-key')
    .get(getRazorpayKEY);

router
    .route('/subscribe')
    .post(isLoggedIn, buySubscription);

router
    .route('/verify')
    .post(isLoggedIn,verifySubscription);

router
    .route('/unsubscribe')
    .post(isLoggedIn,authorizeSub,cancelSubscription);

router
    .route('/')
    .get(isLoggedIn,
        authorizeRoles('ADMIN'),
        allPayments);

export default router;