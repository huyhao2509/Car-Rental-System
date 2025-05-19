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
router.get('/data', HangXeController.getData.bind(HangXeController));
router.post('/update', HangXeController.update.bind(HangXeController));
router.post('/create', HangXeController.create.bind(HangXeController));
router.delete('/delete/:id', HangXeController.delete.bind(HangXeController));
router.get('/change-status/:id', HangXeController.changeStatus.bind(HangXeController));

module.exports = router;