import { Router } from "express";
import  getContact  from "../controllers/generalController.js";

const router = Router();

router.post('/',getContact)
export default router;