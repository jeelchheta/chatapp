import { io } from "socket.io-client";
import config from "./api.json";

const socket = io(config.SOCKETURL, {
  autoConnect: false,
});

export default socket;