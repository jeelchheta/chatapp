export const StatusConstant = [
    "ACTIVE",
    "INACTIVE",
    "DELETED"
]

export const UserDefaultStatus = "ACTIVE"

export const DELETEDStatus = "DELETED"

export const Message = {
    400: "Bad Request",
    401: "Unauthorized – Authentication required",
    409: "Conflict",
    404: "Not Found",
    500: "Internal Server Error",
    200: "OK – success.",
    201: "Created",
    "Internal_S_E": 'Internal Server Error',
    "No_token_provided": 'Unauthorized: No token provided',
    "Invalid_token": 'Invalid token'
}

export const UserRole = {
    SYSTEMADMIN: "SYSTEMADMIN",
    USER: "USER"
}

export const DBCollections = {
    users: "users",
    chatrooms: "chatrooms",
    chatmessages: "chatmessages"
}

export const Templates = {
    opt:"Your Verification Code: [Insert Code]"
}

export const DateFormate={
    MMMMDoYYYYhmmssa:"MMMM Do YYYY, h:mm:ss a"
}

export const OTP_EXPIRATION_MIN = process.env.OTP_EXPIRATION_MIN || 5;