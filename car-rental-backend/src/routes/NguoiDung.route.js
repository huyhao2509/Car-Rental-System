const express = require('express');
const router = express.Router();
const NguoiDungController = require('../controllers/NguoiDungController');
const { uploadAvatar, uploadDocuments } = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập
router.post('/register', NguoiDungController.register.bind(NguoiDungController));
router.post('/login', NguoiDungController.login.bind(NguoiDungController));
router.post('/check-login', NguoiDungController.checkLogin.bind(NguoiDungController));

// Route cho OTP và quên mật khẩu
router.post('/send-otp', NguoiDungController.sendOTP.bind(NguoiDungController));
router.post('/verify-otp', NguoiDungController.verifyOTP.bind(NguoiDungController));
router.post('/forgot-password', NguoiDungController.forgotPassword.bind(NguoiDungController));
router.post('/reset-password', NguoiDungController.resetPassword.bind(NguoiDungController));

// Route cho profile - yêu cầu đăng nhập
router.post(
    '/profile/update',
    verifyToken,
    uploadDocuments,
    NguoiDungController.updateProfile.bind(NguoiDungController)
);
router.get('/profile', verifyToken, NguoiDungController.getProfile.bind(NguoiDungController));

router.post(
    '/profile/upload-avatar',
    verifyToken,
    uploadAvatar,
    NguoiDungController.uploadAvatar.bind(NguoiDungController)
);

// Route xóa ảnh căn cước công dân
router.delete(
    '/profile/delete-can-cuoc',
    verifyToken,
    NguoiDungController.deleteCanCuoc.bind(NguoiDungController)
);

// Route xóa ảnh bằng lái xe
router.delete(
    '/profile/delete-bang-lai',
    verifyToken,
    NguoiDungController.deleteBangLai.bind(NguoiDungController)
);

module.exports = router;
