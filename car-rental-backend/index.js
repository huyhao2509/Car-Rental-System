import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/connectDB.js";
import { connectRedis } from "./src/config/connectRedis.js";
import initRoutes from "./src/routes/index.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Khởi tạo chatbot service để chạy nền
// import './src/services/chatbotService.js';

// Import schedule fetch MB transactions
// import './src/services/mbTransactionScheduler.js';


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["POST", "GET", "PUT", "DELETE"],
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRoutes(app);
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
