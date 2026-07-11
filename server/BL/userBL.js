import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { generateCode } from "../utils/utility.js";
import Moment from "moment";
import { OTP_EXPIRATION_MIN, PASSWORD_SALT_ROUNDS, TOKEN_EXPIRATION_MIN } from "../constant/constant.js";
import Mongoose from "../config/db.js";

export async function registerUserBL(newUser) {
    try {
        const hashedPassword = await bcrypt.hash(newUser.password, PASSWORD_SALT_ROUNDS);
        const otp = generateCode(6, true),
            otpExpire = Moment(new Date()).add(OTP_EXPIRATION_MIN, "m")
        const result = await User.updateOne(
            { username: newUser.username },
            {
                $set: {
                    username: newUser.username,
                    uid: generateCode(10),
                    password: hashedPassword,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    role: newUser.role,
                    otp: otp,
                    otpExpire: otpExpire
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            })

        return { otp, otpExpire }
    }
    catch (err) {
        throw err
    }

}

export async function verifyOTPBL(newUser) {
    try {
        const result = await User.updateOne(
            { username: newUser.username },
            {
                $set: {
                    username: newUser.username,
                    isVerified: true,
                    otp: null
                }
            })
    }
    catch (err) {
        throw err
    }

}

export async function forgotpasswordBL(newUser) {
    try {

        const token = generateCode(16),
            tokenExpire = Moment(new Date()).add(TOKEN_EXPIRATION_MIN, "m")
        const result = await User.updateOne(
            { username: newUser.username },
            {
                $set: {
                    token: token,
                    tokenExpire: tokenExpire
                }
            })

        return { token, tokenExpire }
    }
    catch (err) {
        throw err
    }

}

export async function updatepasswordBL(request) {
    try {

        const hashedPassword = await bcrypt.hash(request.password, PASSWORD_SALT_ROUNDS);
        const result = await User.updateOne(
            { token: request.token },
            {
                $set: {
                    token: null,
                    password: hashedPassword
                }
            })
    }
    catch (err) {
        throw err
    }

}

export async function validateEmailAndContact(newUser) {
    try {
        let query = {
            username: newUser.username,
            isVerified: true
        };

        return await User.findOne(query)
    }
    catch (err) {
        throw err
    }
}

export async function getTokenBaseUser(user) {
    try {
        let query = {
            token: user.token,
            isVerified: true
        };

        return await User.findOne(query)
    }
    catch (err) {
        throw err
    }
}

export async function getUnVerifiedUser(newUser) {
    try {
        let query = {
            username: newUser.username,
            isVerified: false
        };

        return await User.findOne(query)
    }
    catch (err) {
        throw err
    }
}

export async function loginUserBL(newUser) {
    try {
        const user = await User.findOne({ username: newUser.username, isVerified: true });

        if (user && bcrypt.compareSync(newUser.password, user.password)) {
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    uid: user.uid,
                    role: user.role,
                    status: user.status
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_TIMEOUT }
            );
            return {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                uid: user.uid,
                role: user.role,
                token: token
            }
        }

        return null

    }
    catch (err) {
        throw err
    }

}

export async function searchuser(search, loggedinuserid) {
    try {
        const q = [
            {
                $match: {
                    _id: { $ne: new Mongoose.Types.ObjectId(loggedinuserid) },
                    isVerified: true,
                    $or: [
                        { uid: { $regex: search, $options: "i" } },
                        { firstname: { $regex: search, $options: "i" } },
                        { lastname: { $regex: search, $options: "i" } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: {
                                        $concat: ["$firstname", " ", "$lastname"]
                                    },
                                    regex: search, options: "i"
                                }
                            }
                        }
                    ]

                }
            },
            {
                $project: {
                    // username: 1,
                    firstname: 1,
                    uid: 1,
                    lastname: 1,
                }
            }];

        const users = await User.aggregate(q).exec();
        return users;
    }
    catch (err) {
        throw err
    }

}