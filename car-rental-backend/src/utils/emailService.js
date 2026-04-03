const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS environment variable');
}

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

/**
 * Gửi email chứa mã OTP
 * @param {string} to Địa chỉ email người nhận
 * @param {string} otp Mã OTP
 * @returns {Promise} Kết quả gửi email
 */
const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Car Rental - Mã xác thực OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #3498db; text-align: center;">Car Rental System</h2>
                <p>Xin chào,</p>
                <p>Mã xác thực OTP của bạn là:</p>
                <h3 style="text-align: center; background-color: #f8f9fa; padding: 10px; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
                <p>Mã này sẽ hết hạn sau 5 phút.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d;">
                    © ${new Date().getFullYear()} Car Rental System. Tất cả các quyền đã được bảo lưu.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Lỗi khi gửi email OTP:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Gửi email chứa mật khẩu mới
 * @param {string} to Địa chỉ email người nhận
 * @param {string} newPassword Mật khẩu mới
 * @returns {Promise} Kết quả gửi email
 */
const sendPasswordResetEmail = async (to, newPassword) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Car Rental - Mật khẩu mới của bạn',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #3498db; text-align: center;">Car Rental System</h2>
                <p>Xin chào,</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                <p>Đây là mật khẩu mới của bạn:</p>
                <h3 style="text-align: center; background-color: #f8f9fa; padding: 10px; font-size: 18px;">${newPassword}</h3>
                <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay sau khi bạn đăng nhập thành công.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với bộ phận hỗ trợ ngay lập tức.</p>
                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d;">
                    © ${new Date().getFullYear()} Car Rental System. Tất cả các quyền đã được bảo lưu.
                </p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Lỗi khi gửi email đặt lại mật khẩu:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendPasswordResetEmail,
};
