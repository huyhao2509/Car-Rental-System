import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/connectDB.js";
import { connectRedis } from "./src/config/connectRedis.js";
import initRoutes from "./src/routes/index.js";
const path = require('path');

import './src/services/mbTransactionScheduler.js';


dotenv.config();

const app = express();
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

const port = process.env.PORT || 8888;
const listener = app.listen(port, async () => {
    console.log(`Server is running on the port ${listener.address().port}`);
});
