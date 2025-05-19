import nodemailer from "nodemailer";
import 'dotenv/config';

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Hàm gửi email chứa mã OTP
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Mã xác thực đăng nhập - Car Rental Service",
            html: `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mã OTP Xác Thực</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="max-w-md mx-auto my-8 p-6 bg-white shadow-md rounded-lg border border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Xác thực đăng nhập</h2>
                    <p class="text-gray-600 mb-4">Xin chào,</p>
                    <p class="text-gray-600 mb-4">Cảm ơn bạn đã sử dụng dịch vụ thuê xe tự lái của chúng tôi. Đây là mã xác thực (OTP) của bạn:</p>
                    
                    <div class="bg-gray-100 p-4 rounded-lg text-center mb-4">
                        <h1 class="text-4xl font-bold text-blue-600 tracking-widest">${otp}</h1>
                    </div>
                    
                    <p class="text-gray-500 text-sm mb-4">Mã này sẽ hết hạn sau 5 phút.</p>
                    
                    <p class="text-gray-500 text-sm mb-4">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                    
                    <p class="text-gray-600 mt-6">
                        Trân trọng,<br>
                        <span class="font-semibold">Car Rental Team</span>
                    </p>
                </div>
            </body>
            </html>
            `,
        };
        
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send OTP email");
    }
};

export { sendOTPEmail };
