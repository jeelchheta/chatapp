import Mongoose from "../config/db.js";
import { Message } from "../constant/constant.js";
import ChatMessage from "../models/ChatMessage.js";
import ChatRoom from "../models/ChatRoom.js";
import { BaseResponse } from "../utils/utility.js";

export async function createMessage(req, res) {
  try {
    const {
      receiverId,
      message,
      chatroomId
    } = req.body;

    if ((!receiverId ||
      !message)
    ) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    if (!chatroomId) {
      const newChatRoom = new ChatRoom({
        name: null,
        participants: [req.tokendecoded.id, req.body.receiverId],
        isGroup: false,
        createdBy: req.tokendecoded.id
      });

      const chatroom = await newChatRoom.save();
      const newChat = new ChatMessage({
        room: chatroom._id,
        sender: req.tokendecoded.id,
        text: message
      });
      const chat = await newChat.save();
      await ChatRoom.updateOne(
        { "_id": chatroom._id },
        {
          $set: {
            lastMessage: chat._id
          }
        }
      )
    }
    else {
      const chat = await ChatMessage.create({
        room: chatroomId,
        sender: req.tokendecoded.id,
        text: message
      });

      const updatedRoom = await ChatRoom.findByIdAndUpdate(
        chatroomId,
        {
          lastMessage: chat._id
        },
        { new: true }
      );

    }

    return res.status(200).json(BaseResponse(200, Message[200], null));

  } catch (err) {
    next(err);
  }
};

export async function getMessages(req, res) {
  try {
    const { chatRoomId } = req.params;

    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);
    const skip = (page - 1) * limit;

    if (!chatRoomId) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    const q = [
      {
        $match: {
          room: new Mongoose.Types.ObjectId(req.params.chatRoomId)
        }
      },
      {
        $sort: {
          createdAt: -1,
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          "_id": 1,
          "room": 1,
          "sender": 1,
          "text": 1,
          "createdAt": 1,
          "updatedAt": 1,
        }
      },
      {
        $sort: {
          createdAt: 1
        }
      }
    ]
    const messages = await ChatMessage.aggregate(q).exec();

    return res.status(200).json(BaseResponse(200, Message[200], messages));
  } catch (err) {
    next(err);
  }
};
