const express = require('express');
const router = express.Router();
const HangXeController = require('../controllers/HangXeController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập
// router.get('/', HangXeController.getAll);
// router.get('/phan-trang', HangXeController.getPagination);
// router.get('/:id', HangXeController.getById);

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);

// Route quản lý hãng xe
router.get('/data', checkPermission(6), HangXeController.getData.bind(HangXeController));
router.post('/create', checkPermission(7), HangXeController.create.bind(HangXeController));
router.post('/update', checkPermission(8), HangXeController.update.bind(HangXeController));
router.delete('/delete/:id', checkPermission(9), HangXeController.delete.bind(HangXeController));
router.get('/change-status/:id', checkPermission(10), HangXeController.changeStatus.bind(HangXeController));

module.exports = router;