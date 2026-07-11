import fs from "fs/promises";
import path from "path";
import Moment from "moment";
import { DateFormate } from "../constant/constant.js";

export async function getOTPTemplate(OTPCode, ExpDate) {
    try {
        const filePath = path.resolve("server/templates/otp.txt");
        const data = await fs.readFile(filePath, "utf8");
        let [subject, body] = data.split("[Subject:]");
        subject = subject.replaceAll("{OTPCode}", OTPCode);
        body = body.
            replaceAll("{OTPCode}", OTPCode).
            replaceAll("{Company}", process.env.AppName || "Company").
            replaceAll("{ExpDate}", Moment(ExpDate).format(DateFormate.MMMMDoYYYYhmmssa))
        return { subject, body }

    } catch (err) {
        throw err
    }
}

export async function getOTPPasswordResetTemplate(req, token, ExpDate) {
    try {
        const protocol = req.protocol, host = req.get("host");
        const resetLink = `${protocol}://${host}/reset-password/${token}`;

        const filePath = path.resolve("server/templates/forgotpassword.txt");
        const data = await fs.readFile(filePath, "utf8");
        let [subject, body] = data.split("[Subject:]");
        body = body.
            replaceAll("{ResetLink}", resetLink).
            replaceAll("{Company}", process.env.AppName || "Company").
            replaceAll("{ExpDate}", Moment(ExpDate).format(DateFormate.MMMMDoYYYYhmmssa))
        return { subject, body }

    } catch (err) {
        throw err
    }
}