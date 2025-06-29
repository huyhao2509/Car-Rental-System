const express = require('express');
const router = express.Router();
const KhuyenMaiController = require('../controllers/KhuyenMaiController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập


// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);

// Route quản lý khuyến mãi
router.get('/lay-khuyen-mai-all', checkPermission(37), KhuyenMaiController.layDanhSachKhuyenMai.bind(KhuyenMaiController));
router.post('/them-khuyen-mai', checkPermission(38), KhuyenMaiController.themKhuyenMai.bind(KhuyenMaiController));
router.post('/cap-nhat-khuyen-mai', checkPermission(39), KhuyenMaiController.capNhatKhuyenMai.bind(KhuyenMaiController));
router.delete('/xoa-khuyen-mai/:id', checkPermission(40), KhuyenMaiController.xoaKhuyenMai.bind(KhuyenMaiController));

module.exports = router;
