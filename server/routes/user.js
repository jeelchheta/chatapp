import express from "express";

import { getAllUsers, getUser, registerUser, loginUser, searchUsers, verifyOTP, forgotpassword, setnewpassword } from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/verifyotp', verifyOTP);
router.post('/forgotpassword', forgotpassword);
router.post('/setnewpassword', setnewpassword);
router.post('/login', loginUser);
router.get("/", getAllUsers);
router.get("/searchusers", authMiddleware, searchUsers);
router.get("/:userId", getUser);

export default router;
