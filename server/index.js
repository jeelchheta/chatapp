import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import "./config/db.js";

import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";

import errorHandler from "./middlewares/error.middleware.js";
import { initSocket } from "./chatsocket.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientBuildPath = path.join(
  __dirname,
  "../clientapp/build"
);

// Serve React static files
app.use(express.static(clientBuildPath));

// ---------------- ROUTES ----------------
app.use("/api/room", chatRoomRoutes);
app.use("/api/message", chatMessageRoutes);
app.use("/api/user", userRoutes);

// ---------------- ERROR HANDLER ----------------
app.use(errorHandler);

// Serve React app on all unmatched routes
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(clientBuildPath, "index.html")
  );
});

// ---------------- CREATE HTTP SERVER ----------------
const server = http.createServer(app);

// ---------------- INIT SOCKET ----------------
initSocket(server);

// ---------------- START SERVER ----------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});