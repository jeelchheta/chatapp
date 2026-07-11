import User from "../models/User.js";
import { BaseResponse } from "../utils/utility.js"
import { DateFormate, Message, OTP_EXPIRATION_MIN, TOKEN_EXPIRATION_MIN, UserRole } from "../constant/constant.js"
import { registerUserBL, validateEmailAndContact, loginUserBL, searchuser, verifyOTPBL, getUnVerifiedUser, forgotpasswordBL, getTokenBaseUser, updatepasswordBL } from "../BL/userBL.js"
import { sendEmail } from "../BL/mailHelper.js";
import { getOTPPasswordResetTemplate, getOTPTemplate } from "../templates/Template.js";
import Moment from "moment";

export const getAllUsers = async (req, res, next) => {
  const maxResults = 10;
  let users = [];

  try {
    const userRecords = await User.find().limit(10);

    userRecords.users.forEach((user) => {
      const { uid, email, displayName, photoURL } = user;
      users.push({ uid, email, displayName, photoURL });
    });
    res.status(200).json(users);
  } catch (error) {
    next(err);
  }
};

export async function searchUsers(req, res, next) {
  try {
    const search = req.query.search;

    if (!search) {
      return res.status(404).json(BaseResponse(404, Message[404], null));
    }

    const matchUserList = await searchuser(search, req.tokendecoded.id)

    return res.status(200).json(BaseResponse(200, Message[200], matchUserList));
  } catch (err) {
    next(err);
  }
}

export const getUser = async (req, res) => {
  try {
    const userRecord = await User.findById(userId);

    const { uid, email, displayName, photoURL } = userRecord;

    res.status(200).json({ uid, email, displayName, photoURL });
  } catch (error) {
    console.log(error);
  }
};


export async function registerUser(req, res, next) {
  try {
    const {
      username,
      password,
      firstname,
      lastname
    } = req.body;

    if (!username ||
      !password ||
      !firstname ||
      !lastname
    ) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    let checkEmailAndContact = await validateEmailAndContact(req.body);
    if (checkEmailAndContact) {
      return res.status(409).json(BaseResponse(409, Message[409], null));
    }

    req.body.role = UserRole.USER

    const newUser = await registerUserBL(req.body)
    const { subject, body } = await getOTPTemplate(newUser.otp, newUser.otpExpire)
    await sendEmail(req.body.username, subject, body)

    return res.status(201).json(BaseResponse(201, Message[201], null));
  } catch (err) {
    next(err);
  }
};

export async function verifyOTP(req, res, next) {
  try {
    const {
      username,
      otp
    } = req.body;

    if (!otp || !username) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    let checkEmailAndContact = await validateEmailAndContact(req.body);
    if (checkEmailAndContact) {
      return res.status(409).json(BaseResponse(409, Message[409], null));
    }

    const newUser = await getUnVerifiedUser(req.body);
    if (!newUser) {
      return res.status(404).json(BaseResponse(404, Message[404], null));
    }
    else {
      if (otp != newUser.otp) {
        return res.status(400).json(BaseResponse(400, Message[400], null));
      }
      else if (Moment(new Date()).diff(newUser.otpExpire, "minutes") > OTP_EXPIRATION_MIN) {
        return res.status(400).json(BaseResponse(400, Message[400], null));
      }
    }

    await verifyOTPBL(req.body)

    return res.status(200).json(BaseResponse(200, Message[200], null));
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  try {
    const {
      username,
      password
    } = req.body;

    if (!username && !password) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    // Save the new user
    let userinfo = await loginUserBL(req.body)

    if (!userinfo?.token) {
      res.status(401).json(BaseResponse(401, Message[401], null));
    }
    else {
      res.status(200).json(BaseResponse(200, Message[200], userinfo));
    }
  } catch (err) {
    next(err);
  }
};

export async function forgotpassword(req, res, next) {
  try {
    const {
      username
    } = req.body;

    if (!username) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    let checkEmailAndContact = await validateEmailAndContact(req.body);
    if (!checkEmailAndContact) {
      return res.status(404).json(BaseResponse(404, Message[404], null));
    }

    const newUser = await forgotpasswordBL(req.body)
    const { subject, body } = await getOTPPasswordResetTemplate(req, newUser.token, newUser.tokenExpire)
    await sendEmail(req.body.username, subject, body)

    return res.status(200).json(BaseResponse(200, Message[200], null));
  } catch (err) {
    next(err);
  }
};

export async function setnewpassword(req, res, next) {
  try {
    const {
      token,
      password
    } = req.body;

    if (!token || !password) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    let user = await getTokenBaseUser(req.body);
    if (!user) {
      return res.status(404).json(BaseResponse(404, Message[404], null));
    }
    else if (Moment(new Date()).diff(user.tokenExpire, "minutes") > TOKEN_EXPIRATION_MIN) {
      return res.status(400).json(BaseResponse(400, Message[400], null));
    }

    await updatepasswordBL(req.body)

    return res.status(200).json(BaseResponse(200, Message[200], null));
  } catch (err) {
    next(err);
  }
};