const express = require('express');
const router = express.Router();
const DonHangController = require('../controllers/DonHangController');
// const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route yêu cầu đăng nhập và phân quyền
// router.use(verifyToken);
router.post('/them-gio-hang', DonHangController.themGioHang.bind(DonHangController));
router.get('/lay-gio-hang', DonHangController.layGioHang.bind(DonHangController));
router.delete('/xoa-gio-hang/:id', DonHangController.xoaGioHang.bind(DonHangController));
router.post('/thanh-toan', DonHangController.thanhToan.bind(DonHangController));
router.get('/lay-don-hang', DonHangController.layDonHang.bind(DonHangController));
router.get('/huy-don-hang/:id', DonHangController.huyDonHang.bind(DonHangController));
router.get('/lay-don-hang-all', DonHangController.layDonHangAll.bind(DonHangController));
router.post('/create-payment-url', DonHangController.createPaymentUrl.bind(DonHangController));

router.get('/lay-don-hang-all-admin', DonHangController.layDonHangAllAdmin.bind(DonHangController));
router.post('/xac-nhan-thanh-toan/:id', DonHangController.xacNhanThanhToan.bind(DonHangController));
router.post('/cap-nhat-trang-thai', DonHangController.capNhatTrangThai.bind(DonHangController));




module.exports = router;