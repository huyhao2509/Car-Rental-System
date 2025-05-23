const express = require('express');
const router = express.Router();
const DonHangController = require('../controllers/DonHangController');
const { verifyToken } = require('../middlewares/auth');

// Dashboard stats không yêu cầu xác thực
router.get('/admin/dashboard-stats', DonHangController.dashboardStats.bind(DonHangController));
// Reports endpoint cho trang báo cáo
router.get('/admin/reports', DonHangController.getReports.bind(DonHangController));

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);
router.post('/them-gio-hang', DonHangController.themGioHang.bind(DonHangController));
router.get('/lay-gio-hang', DonHangController.layGioHang.bind(DonHangController));
router.delete('/xoa-gio-hang/:id', DonHangController.xoaGioHang.bind(DonHangController));
router.post('/thanh-toan', DonHangController.thanhToan.bind(DonHangController));
router.get('/lay-don-hang', DonHangController.layDonHang.bind(DonHangController));
router.get('/huy-don-hang/:id', DonHangController.huyDonHang.bind(DonHangController));
router.get('/lay-don-hang-all', DonHangController.layDonHangAll.bind(DonHangController));
router.post('/get-ma-khuyen-mai', DonHangController.getMaKhuyenMai.bind(DonHangController));

// Route lấy lịch sử đơn hàng theo người dùng
router.get('/history', DonHangController.getHistoryByUser.bind(DonHangController));

router.get('/lay-don-hang-all-admin', DonHangController.layDonHangAllAdmin.bind(DonHangController));
router.post('/xac-nhan-thanh-toan/:id', DonHangController.xacNhanThanhToan.bind(DonHangController));
router.post('/cap-nhat-trang-thai', DonHangController.capNhatTrangThai.bind(DonHangController));
// Khai báo đường dẫn API
router.get('/', DonHangController.getAll.bind(DonHangController));
// router.get('/history', DonHangController.getHistoryByUser.bind(DonHangController));
router.get('/:id', DonHangController.getById.bind(DonHangController));
router.post('/', DonHangController.create.bind(DonHangController));
router.put('/:id', DonHangController.update.bind(DonHangController));
router.delete('/:id', DonHangController.delete.bind(DonHangController));

module.exports = router;