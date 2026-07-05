import jwt from 'jsonwebtoken';
import { BaseResponse } from "../utils/utility.js"
import { Message } from '../constant/constant.js';

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(BaseResponse(401, Message.No_token_provided, null));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.tokendecoded = decoded; // attach decoded user to request
    next();
  } catch (err) {
    return res.status(401).json(BaseResponse(401, Message.Invalid_token, null));
  }
};


export function authMiddlewareSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.tokendecoded = decoded;  // attach decoded value to socket
    return next();

  } catch (e) {
    return next(new Error("Auth Middleware Socket Error"));
  }
};
