export function BaseResponse(
  statuscode,
  message,
  response
) {
  return {
    statuscode: statuscode,
    message: message,
    response: response
  }
}

export function generateCode(length = 8, onlyNumber = false) {
  const chars_Set1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", chars_Set2 = "0123456789";
  let result = ""
  if (onlyNumber) {
    for (let i = 0; i < length; i++) {
      result += chars_Set2.charAt(Math.floor(Math.random() * chars_Set2.length));
    }
    return result
  }
  const chars = chars_Set1 + chars_Set2
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}