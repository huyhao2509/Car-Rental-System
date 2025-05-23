const express = require('express');
const router = express.Router();
const PhanQuyenController = require('../controllers/PhanQuyenController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);

// Quản lý chức vụ
router.get('/get-all', PhanQuyenController.getAll.bind(PhanQuyenController));
router.post('/create', PhanQuyenController.create.bind(PhanQuyenController));
router.post('/update', PhanQuyenController.update.bind(PhanQuyenController));
router.get('/delete/:id', PhanQuyenController.delete.bind(PhanQuyenController));
router.get('/change-status/:id', PhanQuyenController.changeStatus.bind(PhanQuyenController));

// Quản lý chức năng
router.get('/get-all-chuc-nang', PhanQuyenController.getAllChucNang.bind(PhanQuyenController));
router.get('/change-status-chuc-nang/:id', PhanQuyenController.changeStatusChucNang.bind(PhanQuyenController));
router.post('/create-chuc-nang', PhanQuyenController.createChucNang.bind(PhanQuyenController));
router.post('/update-chuc-nang', PhanQuyenController.updateChucNang.bind(PhanQuyenController));
router.get('/delete-chuc-nang/:id', PhanQuyenController.deleteChucNang.bind(PhanQuyenController));

// Quản lý phân quyền
router.get('/get-permissions-by-role/:idChucVu', PhanQuyenController.getPermissionsByRole.bind(PhanQuyenController));
router.post('/update-permissions', PhanQuyenController.updatePermissions.bind(PhanQuyenController));
router.post('/check-user-permissions/:idNguoiDung', PhanQuyenController.checkUserPermissions.bind(PhanQuyenController));

module.exports = router;