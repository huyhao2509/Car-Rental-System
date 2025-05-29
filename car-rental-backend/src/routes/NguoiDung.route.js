const express = require('express');
const router = express.Router();
const NguoiDungController = require('../controllers/NguoiDungController');
const { uploadAvatar, uploadDocuments } = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/auth');
const multer = require('multer');

// Cấu hình multer để xử lý form-data
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

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
    upload.fields([
        { name: 'anhCanCuoc', maxCount: 1 },
        { name: 'anhBangLaiXe', maxCount: 1 }
    ]),
    NguoiDungController.updateProfile.bind(NguoiDungController)
);
router.get(
    '/profile',
    verifyToken,
    NguoiDungController.getProfile.bind(NguoiDungController)
);

router.post(
    '/profile/upload-avatar',
    verifyToken,
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