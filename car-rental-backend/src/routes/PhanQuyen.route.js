const express = require('express');
const router = express.Router();
const PhanQuyenController = require('../controllers/PhanQuyenController');
// const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route yêu cầu đăng nhập và phân quyền
// router.use(verifyToken);
router.get('/get-all', PhanQuyenController.getAll.bind(PhanQuyenController));
router.get('/get-all-chuc-nang', PhanQuyenController.getAllChucNang.bind(PhanQuyenController));
router.post('/create', PhanQuyenController.create.bind(PhanQuyenController));
router.post('/update', PhanQuyenController.update.bind(PhanQuyenController));
router.get('/delete/:id', PhanQuyenController.delete.bind(PhanQuyenController));
router.get('/change-status/:id', PhanQuyenController.changeStatus.bind(PhanQuyenController));
router.get('/change-status-chuc-nang/:id', PhanQuyenController.changeStatusChucNang.bind(PhanQuyenController));


module.exports = router;