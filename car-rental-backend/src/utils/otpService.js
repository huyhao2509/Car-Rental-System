import nodemailer from "nodemailer";
import {redisClient} from "../config/connectRedis";


// Tạo OTP ngẫu nhiên 6 chữ số
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Lưu OTP vào redis với thời gian hết hạn (5 phút)
export const saveOTP = async (email, otp) => {
    try {
        await redisClient.setExAsync(`${email}_otp`, otp, 300);
        return true;
    } catch (error) {
        console.error("Error saving OTP:", error.message);
        throw new Error("Failed to save OTP: " + error.message);
    }
};

// Gửi OTP qua email
export const sendOTPEmail = async (email, otp) => {
    try {
        // Cấu hình nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Mã xác thực OTP cho Car Rental",
            text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending OTP email:", error.message);
        throw new Error("Failed to send OTP email: " + error.message);
    }
};

// Tạo và gửi OTP
export const generateAndSendOTP = async (email) => {
    try {
        const otp = generateOTP();
        // Lưu OTP trước khi gửi email
        await saveOTP(email, otp);
        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.log(
                "Gửi email thất bại nhưng OTP vẫn được lưu trong database."
            );
        }
        return otp;
    } catch (error) {
        console.error("Error generating and sending OTP:", error.message);
        console.error("Stack trace:", error.stack);
        throw new Error("Failed to generate and send OTP: " + error.message);
    }
};

// Xác thực OTP
export const verifyOTP = async (email, otp) => {
    try {
        const savedOTP = await redisClient.getAsync(`${email}_otp`);
        if (savedOTP === otp) {
            await redisClient.delAsync(`${email}_otp`);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Failed to verify OTP");
    }
};
