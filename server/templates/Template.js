import fs from "fs/promises";
import path from "path";
import Moment from "moment";
import { DateFormate } from "../constant/constant.js";

export async function getOTPTemplate(OTPCode, ExpDate) {
    try {
        const filePath = path.resolve("server/templates/otp.txt");
        const data = await fs.readFile(filePath, "utf8");
        let [subject, body] = data.split("[Subject:]");
        subject = subject.replace("{OTPCode}", OTPCode);
        body = body.
            replace("{OTPCode}", OTPCode).
            replace("{Company}", process.env.AppName || "Company").
            replace("{ExpDate}", Moment(ExpDate).format(DateFormate.MMMMDoYYYYhmmssa))
        return { subject, body }

    } catch (err) {
        throw err
    }
}