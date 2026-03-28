const express = require('express');
const nguoiDungRouter = require('./NguoiDung.route');
const hangXeRouter = require('./HangXe.route');
const loaiXeRouter = require('./LoaiXe.route');
const phanQuyenRouter = require('./PhanQuyen.route');
const AdminNguoiDungRouter = require('./AdminNguoiDung.route');
const XeRouter = require('./XeRouter.route');
const DonHangRouter = require('./DonHang.route');
const KhuyenMaiRouter = require('./KhuyenMai.route');
const ChatbotRouter = require('./Chatbot.route.js');
// const ChatbotRouter = require('./Chatbot.route');

const initRoutes = (app) => {
    app.use('/api/admin/hang-xe', hangXeRouter);
    app.use('/api/admin/loai-xe', loaiXeRouter);
    app.use('/api/admin/chuc-vu', phanQuyenRouter);
    app.use('/api/admin/nguoi-dung', AdminNguoiDungRouter);
    app.use('/api/admin/xe', XeRouter);
    app.use('/api/admin/don-hang', DonHangRouter);
    app.use('/api/admin/khuyen-mai', KhuyenMaiRouter);


    app.use('/api/nguoi-dung', nguoiDungRouter);
    app.use('/api/client/xe', XeRouter);
    app.use('/api/client/don-hang', DonHangRouter);

    app.use('/api/chatbot', ChatbotRouter);

    // app.use('/api/v1/chatbot', ChatbotRouter);

    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Car Rental API is running'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Không tìm thấy API này'
        });
    });
};

module.exports = initRoutes;
