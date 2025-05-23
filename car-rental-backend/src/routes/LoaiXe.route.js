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
router.get('/get-all', LoaiXeController.getAll.bind(LoaiXeController));
router.post('/update', LoaiXeController.update.bind(LoaiXeController));
router.post('/create', LoaiXeController.create.bind(LoaiXeController));
// router.post('/', checkPermission('THEM_L_O_A_I_X_E'), LoaiXeController.create);
// router.put('/:id', checkPermission('SUA_L_O_A_I_X_E'), LoaiXeController.update);
router.delete('/delete/:id', LoaiXeController.delete.bind(LoaiXeController));
router.get('/change-status/:id', LoaiXeController.changeStatus.bind(LoaiXeController));

module.exports = router;