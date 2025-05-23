const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');         
const NguoiDungController = require('../controllers/NguoiDungController');

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);
router.get('/get-all', NguoiDungController.getAll.bind(NguoiDungController));
router.post('/create', NguoiDungController.createAdmin.bind(NguoiDungController));
router.post('/update', NguoiDungController.updateAdmin.bind(NguoiDungController));
router.get('/delete/:id', NguoiDungController.deleteAdmin.bind(NguoiDungController));

router.get('/change-status/:id', NguoiDungController.changeStatus.bind(NguoiDungController));
router.post('/change-password', NguoiDungController.changePassword.bind(NguoiDungController));

module.exports = router;