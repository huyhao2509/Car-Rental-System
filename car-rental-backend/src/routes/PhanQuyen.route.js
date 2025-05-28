const express = require('express');
const router = express.Router();
const PhanQuyenController = require('../controllers/PhanQuyenController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);

// Quản lý chức vụ
router.get('/get-all', checkPermission(16), PhanQuyenController.getAll.bind(PhanQuyenController));
router.post('/create', checkPermission(17), PhanQuyenController.create.bind(PhanQuyenController));
router.post('/update', checkPermission(18), PhanQuyenController.update.bind(PhanQuyenController));
router.get('/delete/:id', checkPermission(19), PhanQuyenController.delete.bind(PhanQuyenController));
router.get('/change-status/:id', checkPermission(20), PhanQuyenController.changeStatus.bind(PhanQuyenController));

// Quản lý chức năng
router.get('/get-all-chuc-nang', checkPermission(21), PhanQuyenController.getAllChucNang.bind(PhanQuyenController));
router.post('/create-chuc-nang', checkPermission(22), PhanQuyenController.createChucNang.bind(PhanQuyenController));
router.post('/update-chuc-nang', checkPermission(23), PhanQuyenController.updateChucNang.bind(PhanQuyenController));
router.get('/delete-chuc-nang/:id', checkPermission(24), PhanQuyenController.deleteChucNang.bind(PhanQuyenController));
router.get('/change-status-chuc-nang/:id', checkPermission(25), PhanQuyenController.changeStatusChucNang.bind(PhanQuyenController));

// Quản lý phân quyền
router.get('/get-permissions-by-role/:idChucVu', checkPermission(26), PhanQuyenController.getPermissionsByRole.bind(PhanQuyenController));
router.post('/update-permissions', checkPermission(28), PhanQuyenController.updatePermissions.bind(PhanQuyenController));
router.post('/check-user-permissions/:idNguoiDung', checkPermission(26), PhanQuyenController.checkUserPermissions.bind(PhanQuyenController));

module.exports = router;