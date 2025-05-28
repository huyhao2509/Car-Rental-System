const express = require('express');
const router = express.Router();
const LoaiXeController = require('../controllers/LoaiXeController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập
// router.get('/', LoaiXeController.getAll);
// router.get('/phan-trang', LoaiXeController.getPagination);
// router.get('/:id', LoaiXeController.getById);

// // Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);

// Route quản lý loại xe
router.get('/get-all', checkPermission(1), LoaiXeController.getAll.bind(LoaiXeController));
router.post('/create', checkPermission(2), LoaiXeController.create.bind(LoaiXeController));
router.post('/update', checkPermission(3), LoaiXeController.update.bind(LoaiXeController));
router.delete('/delete/:id', checkPermission(4), LoaiXeController.delete.bind(LoaiXeController));
router.get('/change-status/:id', checkPermission(5), LoaiXeController.changeStatus.bind(LoaiXeController));

module.exports = router;