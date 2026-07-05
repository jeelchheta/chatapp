import express from "express";

import {
  createChatRoom,
  getChatRoomOfUser,
  getChatRoomOfUsers,
} from "../controllers/chatRoom.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/", authMiddleware, createChatRoom);
router.get("/list", authMiddleware, getChatRoomOfUser);
router.get("/:firstUserId/:secondUserId", getChatRoomOfUsers);

export default router;
