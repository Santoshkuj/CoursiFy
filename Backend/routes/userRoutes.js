import {Router} from "express"
import { register,login,logout,getProfile, forgotPassword, resetPassword, changePassword, updateUser, getUserStats } from "../controllers/userController.js";
import { authorizeRoles, isLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddlewware.js";
const router = Router();

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',isLoggedIn,getProfile);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.post('/change-password',isLoggedIn,changePassword);
router.get('/stats',isLoggedIn,authorizeRoles('ADMIN'),getUserStats);
router.put('/update',isLoggedIn,upload.single('avatar'),updateUser)

export default router;                                                                                                      