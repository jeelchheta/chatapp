import Mongoose from "../config/db.js";
import { StatusConstant, UserDefaultStatus, DBCollections } from "../constant/constant.js";

const userSchema = new Mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    uid: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, enum: StatusConstant, default: UserDefaultStatus },
    otp: String,
    otpExpire: Date,
    isVerified: { type: Boolean, default: false },
    token: String,
    tokenExpire: Date
}, { timestamps: true });

const User = Mongoose.model(DBCollections.users, userSchema);

export default User

