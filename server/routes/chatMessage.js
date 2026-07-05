import express from "express";

import { createMessage, getMessages } from "../controllers/chatMessage.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createMessage);
router.get("/:chatRoomId",authMiddleware, getMessages);

export default router;
