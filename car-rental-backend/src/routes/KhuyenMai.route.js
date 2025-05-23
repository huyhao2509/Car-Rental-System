const express = require('express');
const router = express.Router();
const KhuyenMaiController = require('../controllers/KhuyenMaiController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập


// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);
router.get('/lay-khuyen-mai-all', KhuyenMaiController.layDanhSachKhuyenMai.bind(KhuyenMaiController));
router.post('/them-khuyen-mai', KhuyenMaiController.themKhuyenMai.bind(KhuyenMaiController));
router.post('/cap-nhat-khuyen-mai', KhuyenMaiController.capNhatKhuyenMai.bind(KhuyenMaiController));
router.delete('/xoa-khuyen-mai/:id', KhuyenMaiController.xoaKhuyenMai.bind(KhuyenMaiController));

module.exports = router;