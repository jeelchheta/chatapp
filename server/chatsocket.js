import { Server } from "socket.io";
import ChatRoom from "./models/ChatRoom.js";
import ChatMessage from "./models/ChatMessage.js";
import { authMiddlewareSocket } from "./middlewares/auth.middleware.js";
import User from "./models/User.js";

const onlineUsers = new Object();
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.use(authMiddlewareSocket);

  io.on("connection", (socket) => {
    const userId = socket.tokendecoded?.id;

    if (!userId) {
      socket.disconnect();
      return;
    }

    // =========================
    // JOIN PERSONAL ROOM
    // =========================
    socket.join(userId.toString());
    onlineUsers[userId.toString()] = userId.toString();
    io.emit("onlineUsers", onlineUsers);

    // =========================
    // JOIN CHAT ROOM
    // =========================
    socket.on("joinRoom", ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId.toString());
    });

    // =========================
    // LEAVE ROOM
    // =========================
    socket.on("leaveRoom", ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId.toString());
    });

    socket.on("typing", ({ roomId, userId, receiverUsers }) => {
      socket.to(receiverUsers.map(u => u._id.toString())).emit("typing", {
        roomId,
        userId,
      });
    });
    socket.on("stopTyping", ({ roomId, userId, receiverUsers }) => {
      socket.to(receiverUsers.map(u => u._id.toString())).emit("stopTyping", {
        roomId,
        userId,
      });
    });

    // =========================
    // SEND MESSAGE
    // =========================
    socket.on("sendMessage", async (data, callback) => {
      try {
        const { roomId, receiverUsers, text, tempId, toUserParticipants } = data;

        if (!text?.trim() || !receiverUsers) {
          return callback?.({
            success: false,
            message: "Invalid data",
          });
        }

        // =========================
        // FIND OR CREATE ROOM
        // =========================
        let room;

        if (roomId) {
          room = await ChatRoom.findById(roomId);
        } else {
          room = await ChatRoom.findOne({
            isGroup: false,
            participants: { $all: [userId, ...receiverUsers?.map(e => e?._id)] },
          });

          if (!room) {
            room = await ChatRoom.create({
              isGroup: false,
              participants: [userId, ...receiverUsers?.map(e => e?._id)],
            });
          }
        }

        if (!room) {
          return callback?.({
            success: false,
            message: "Room not found",
          });
        }

        const finalRoomId = room._id.toString();

        // =========================
        // JOIN ROOM
        // =========================
        socket.join(finalRoomId);

        // =========================
        // SAVE MESSAGE
        // =========================
        const message = await ChatMessage.create({
          room: finalRoomId,
          sender: userId,
          text: text.trim(),
        });

        await ChatRoom.findByIdAndUpdate(finalRoomId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        // =========================
        // FETCH USERS
        // =========================
        const receiver = receiverUsers;

        // =========================
        // MESSAGE PAYLOAD
        // =========================
        const messagePayload = {
          _id: message._id,
          room: finalRoomId,
          sender: userId,
          text: message.text,
          createdAt: message.createdAt,
        };

        io.to(finalRoomId).emit("receiveMessage", messagePayload);

        // =========================
        // ROOM PAYLOAD (REALTIME FIX)
        // =========================
        const selfRoomPayload = {
          _id: finalRoomId,
          isGroup: false,
          participants: receiverUsers,
          lastMessage: {
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
          }
        };

        const toRoomPayload = {
          ...selfRoomPayload,
          participants: toUserParticipants,
        };

        // send to both users
        io.to(userId.toString()).emit("roomUpdated", { ...selfRoomPayload, tempId });
        // one to meny logic
        io.to(receiverUsers.map(u => u._id.toString())).emit("roomUpdated", toRoomPayload);



        // callback?.({
        //   success: true,
        //   roomId: finalRoomId,
        //   messageId: message._id,
        // });

      } catch (err) {
        console.error("sendMessage error:", err);

        callback?.({
          success: false,
          message: "Server error",
        });
      }
    });

    socket.on("getOnlineUsers", (callback) => {
      callback?.({
        success: true,
        onlineUsers: onlineUsers,
      });
    });

    socket.on("disconnect", () => {
      setTimeout(() => {
        const room = io.sockets.adapter.rooms.get(
          userId.toString()
        );

        // User may have another tab/device connected
        if (!room || room.size === 0) {
          delete onlineUsers[userId.toString()]

          io.emit("onlineUsers", onlineUsers);
        }
      }, 1000);
    });
  });

  return io;
};