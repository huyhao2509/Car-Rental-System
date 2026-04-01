const nodemailer = require("nodemailer");
const { redisClient } = require("../config/connectRedis");

/**
 * Lưu trữ OTP tạm thời trong bộ nhớ
 * Trong môi trường sản xuất, nên lưu trong cơ sở dữ liệu hoặc Redis
 */
const otpStore = new Map();

/**
 * Tạo mã OTP ngẫu nhiên gồm 6 chữ số
 * @returns {string} Mã OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Lưu mã OTP cho email
 * @param {string} email Email của người dùng
 * @param {string} otp Mã OTP
 * @param {number} expiresIn Thời gian hết hạn (miligiây)
 */
const storeOTP = (email, otp, expiresIn = 5 * 60 * 1000) => { // Mặc định 5 phút
    const expiresAt = Date.now() + expiresIn;
    otpStore.set(email.toLowerCase(), { otp, expiresAt });
    
    // Tự động xóa OTP sau khi hết hạn
    setTimeout(() => {
        if (otpStore.has(email.toLowerCase())) {
            otpStore.delete(email.toLowerCase());
        }
    }, expiresIn);
};

/**
 * Xác thực mã OTP
 * @param {string} email Email của người dùng
 * @param {string} otp Mã OTP cần xác thực
 * @returns {boolean} Kết quả xác thực
 */
const verifyOTP = (email, otp) => {
    const lowerEmail = email.toLowerCase();
    const otpData = otpStore.get(lowerEmail);
    
    // Kiểm tra OTP tồn tại không
    if (!otpData) {
        return false;
    }
    
    // Kiểm tra hết hạn
    if (Date.now() > otpData.expiresAt) {
        otpStore.delete(lowerEmail);
        return false;
    }
    
    // Kiểm tra khớp OTP
    const isValid = otpData.otp === otp;
    
    // Nếu OTP hợp lệ, xóa khỏi store
    if (isValid) {
        otpStore.delete(lowerEmail);
    }
    
    return isValid;
};

// Lưu OTP vào redis với thời gian hết hạn (5 phút)
const saveOTP = async (email, otp) => {
    try {
        await redisClient.setExAsync(`${email}_otp`, otp, 300);
        return true;
    } catch (error) {
        console.error("Error saving OTP:", error.message);
        throw new Error("Failed to save OTP: " + error.message);
    }
};

// Gửi OTP qua email
const sendOTPEmail = async (email, otp) => {
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
const generateAndSendOTP = async (email) => {
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

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP,
    saveOTP,
    sendOTPEmail,
    generateAndSendOTP
};
