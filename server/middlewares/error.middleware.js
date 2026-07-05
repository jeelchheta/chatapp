// src/middlewares/error.middleware.js

import { Message } from "../constant/constant.js";
import { BaseResponse } from "../utils/utility.js";

function errorMiddleware(err, req, res, next) {
  console.error('❌ Error:', err.stack);

  const status = err.status || 500;
  const message = err.message || Message.Internal_S_E;

  return res.status(status).json(BaseResponse(500, message, null));
};

export default errorMiddleware;
