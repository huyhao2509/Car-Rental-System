const express = require('express');
const router = express.Router();
const NguoiDungController = require('../controllers/NguoiDungController');
// const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập
router.post('/register', NguoiDungController.register.bind(NguoiDungController));
router.post('/login', NguoiDungController.login.bind(NguoiDungController));
router.post('/check-login', NguoiDungController.checkLogin.bind(NguoiDungController));

// Route yêu cầu đăng nhập và phân quyền
// router.use(verifyToken);


module.exports = router;