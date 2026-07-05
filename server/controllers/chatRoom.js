import { getChatRoomBL } from "../BL/roomBL.js";
import Mongoose from "../config/db.js";
import { DBCollections, Message, UserDefaultStatus } from "../constant/constant.js";
import ChatRoom from "../models/ChatRoom.js";
import { BaseResponse } from "../utils/utility.js";

export async function createChatRoom(req, res, next) {
  try {
    const {
      receiverId
    } = req.body;

    if (!receiverId) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    if (req.tokendecoded.id == req.body.receiverId) {
      return res.status(400).json(BaseResponse(500, Message[500], null));
    }

    const newChatRoom = new ChatRoom({
      name: null,
      participants: [req.tokendecoded.id, req.body.receiverId],
      isGroup: false,
      createdBy: req.tokendecoded.id
    });


    await newChatRoom.save();
    return res.status(201).json(BaseResponse(201, Message[201], null));
  } catch (err) {
    next(err);
  }
};

export async function getChatRoomOfUser(req, res, next) {
  try {

    const userId = new Mongoose.Types.ObjectId(req.tokendecoded.id);

    const q = [
      {
        $match: {
          participants: userId,
        },
      },

      // Remove logged in user
      {
        $addFields: {
          participants: {
            $filter: {
              input: "$participants",
              as: "participant",
              cond: {
                $ne: ["$$participant", userId],
              },
            },
          },
        },
      },

      // Get participant details
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                firstname: 1,
                lastname: 1,
              },
            },
          ],
          as: "participants",
        },
      },

      // Get last message details
      {
        $lookup: {
          from: "chatmessages", // verify collection name
          localField: "lastMessage",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                text: 1,
                createdAt: 1,
              },
            },
          ],
          as: "lastMessage",
        },
      },

      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          isGroup: 1,
          participants: 1,
          lastMessage: 1,
        },
      },

      {
        $sort: {
          "lastMessage.createdAt": -1,
        },
      },
    ]
    const chatRoom = await ChatRoom.aggregate(q).exec();
    // const chatRoom = await getChatRoomBL(req.tokendecoded.id);
    return res.status(200).json(BaseResponse(200, Message[200], chatRoom));
  } catch (err) {
    next(err);
  }
};


export const getChatRoomOfUsers = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.find({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
