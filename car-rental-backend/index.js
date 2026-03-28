const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./src/config/connectDB.js");
const { connectRedis } = require("./src/config/connectRedis.js");
const initRoutes = require("./src/routes/index.js");
const { globalErrorHandler, notFoundHandler } = require("./src/middlewares/errorHandler.js");
const { generalLimiter } = require("./src/middlewares/rateLimiter.js");
const path = require('path');

dotenv.config();

// Khởi tạo chatbot service để chạy nền
require('./src/services/chatbotService.js');

// Chỉ bật scheduler MB khi cấu hình explicit để tránh log lỗi DNS trong môi trường dev.
if (String(process.env.MB_SCHEDULER_ENABLED).toLowerCase() === 'true') {
    require('./src/services/mbTransactionScheduler.js');
}

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting - apply before other middlewares
app.use(generalLimiter);

app.use(
    cors({
        origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ["POST", "GET", "PUT", "DELETE"],
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRoutes(app);

// Error handling middlewares (must be after routes)
app.use(notFoundHandler);
app.use(globalErrorHandler);

connectDB();
connectRedis();

const startServer = () => {
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
        console.log(`\n>>> SERVER ĐÃ SẴN SÀNG TẠI CỔNG ${port} <<<\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`\nLỗi: Cổng ${port} đang được sử dụng. Vui lòng đóng ứng dụng khác đang dùng cổng này và thử lại.\n`);
            process.exit(1);
        } else {
            console.error('Lỗi khi khởi động server:', err);
            process.exit(1);
        }
    });
};

console.log("--- KHỞI ĐỘNG SERVER ---");
startServer();
