import { io } from "socket.io-client";
import config from "./api.json";

const socket = io({
  autoConnect: false,
});

export default socket;