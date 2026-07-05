import { io } from "socket.io-client";
import config from "./api.json";

const socket = io(config.BASEURL_SOCKET_URL, {
  autoConnect: false,
});

export default socket;