import Mongoose from "../config/db.js";
import { DBCollections, StatusConstant, UserDefaultStatus } from "../constant/constant.js";

const ChatRoomSchema = Mongoose.Schema(
  {
    name: {
      type: String
    },
    participants: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: DBCollections.users,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: DBCollections.chatmessages,
      default: null
    },
    status: { type: String, enum: StatusConstant, default: UserDefaultStatus },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: DBCollections.users,
    },
  },
  {
    timestamps: true,
  }
);

const ChatRoom = Mongoose.model(DBCollections.chatrooms, ChatRoomSchema);

export default ChatRoom;
