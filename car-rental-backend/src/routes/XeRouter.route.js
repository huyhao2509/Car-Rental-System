const express = require('express');
const router = express.Router();
const multer = require('multer');
const XeRouterController = require('../controllers/XeRouterController');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Cấu hình multer để lưu file vào memory
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        // Kiểm tra loại file
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
});

router.get('/get-all-client', XeRouterController.getAll.bind(XeRouterController));
router.get('/get-detail-client/:id', XeRouterController.getDetail.bind(XeRouterController));

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);

// Route quản lý xe
router.get('/get-all', checkPermission(11), XeRouterController.getAll.bind(XeRouterController));
router.get(
    '/get-detail/:id',
    checkPermission(11),
    XeRouterController.getDetail.bind(XeRouterController)
);
router.post(
    '/create',
    checkPermission(12),
    upload.single('hinhAnh'),
    XeRouterController.create.bind(XeRouterController)
);
router.post(
    '/update',
    checkPermission(13),
    upload.single('hinhAnh'),
    XeRouterController.update.bind(XeRouterController)
);
router.delete(
    '/delete/:id',
    checkPermission(14),
    XeRouterController.delete.bind(XeRouterController)
);

module.exports = router;
