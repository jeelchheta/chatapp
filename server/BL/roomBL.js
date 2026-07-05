import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";
import ChatRoom from "../models/ChatRoom.js";


export async function createOneChatRoomBL(senderId, receiverId) {
    try {
        const newChatRoom = new ChatRoom({
            name: null,
            participants: [senderId, receiverId],
            isGroup: false,
            createdBy: senderId
        });
        return await newChatRoom.save();
    }
    catch (err) {
        throw err
    }
}

export async function getChatRoomBL(loggedinuserid) {
    try {
        const userId = new Mongoose.Types.ObjectId(loggedinuserid);

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
                    from: DBCollections.users,
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
                    from: DBCollections.chatmessages, // verify collection name
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
        const ls = await ChatRoom.aggregate(q).exec();
        return ls
    }
    catch (err) {
        throw err
    }
}