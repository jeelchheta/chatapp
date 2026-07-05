import Nodemailer from "nodemailer";

export async function sendEmail(to, subject, text) {
    try {
        const transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER, // your Gmail address
                pass: process.env.MAIL_APP_PASSWORD // Gmail App Password
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            text
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    }
    catch (err) {
        throw err
    }
}