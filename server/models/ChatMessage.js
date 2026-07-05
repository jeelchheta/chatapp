import Mongoose from "../config/db.js";
import { DBCollections } from "../constant/constant.js";

const ChatMessageSchema = Mongoose.Schema(
 {
    room: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: DBCollections.chatrooms,
      required: true,
    },

    sender: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: DBCollections.users,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = Mongoose.model(DBCollections.chatmessages, ChatMessageSchema);

export default ChatMessage;
