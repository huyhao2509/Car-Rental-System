const { body, param, query, validationResult } = require('express-validator');
const ResponseUtil = require('../utils/ResponseUtil');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
            value: error.value,
        }));
        return ResponseUtil.validationError(res, formattedErrors);
    }
    next();
};

/**
 * User validation rules
 */
const userValidation = {
    register: [
        body('hoTen')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Họ tên phải có từ 2-100 ký tự'),
        body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'),
        body('soDienThoai').isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
        handleValidationErrors,
    ],

    login: [
        body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
        body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
        handleValidationErrors,
    ],

    updateProfile: [
        body('hoTen')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Họ tên phải có từ 2-100 ký tự'),
        body('soDienThoai')
            .optional()
            .isMobilePhone('vi-VN')
            .withMessage('Số điện thoại không hợp lệ'),
        body('canCuocCongDan')
            .optional()
            .isLength({ min: 9, max: 12 })
            .withMessage('CCCD phải có từ 9-12 ký tự'),
        handleValidationErrors,
    ],
};

/**
 * Car validation rules
 */
const carValidation = {
    create: [
        body('tenXe')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Tên xe phải có từ 2-100 ký tự'),
        body('bienSoXe')
            .trim()
            .matches(/^[0-9]{2}[A-Z]{1,2}-[0-9]{4,5}$/)
            .withMessage('Biển số xe không đúng định dạng (VD: 30A-12345)'),
        body('namSanXuat')
            .isInt({ min: 1990, max: new Date().getFullYear() })
            .withMessage('Năm sản xuất không hợp lệ'),
        body('giaTheoGio').isFloat({ min: 0 }).withMessage('Giá theo giờ phải là số dương'),
        body('giaTheoNgay').isFloat({ min: 0 }).withMessage('Giá theo ngày phải là số dương'),
        body('sucChua').isInt({ min: 1, max: 50 }).withMessage('Sức chứa phải từ 1-50 người'),
        body('idLoaiXe').isInt({ min: 1 }).withMessage('Loại xe không hợp lệ'),
        body('idHangXe').isInt({ min: 1 }).withMessage('Hãng xe không hợp lệ'),
        handleValidationErrors,
    ],

    update: [
        param('id').isInt({ min: 1 }).withMessage('ID xe không hợp lệ'),
        body('tenXe')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Tên xe phải có từ 2-100 ký tự'),
        body('namSanXuat')
            .optional()
            .isInt({ min: 1990, max: new Date().getFullYear() })
            .withMessage('Năm sản xuất không hợp lệ'),
        body('giaTheoGio')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Giá theo giờ phải là số dương'),
        body('giaTheoNgay')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Giá theo ngày phải là số dương'),
        body('sucChua')
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage('Sức chứa phải từ 1-50 người'),
        handleValidationErrors,
    ],
};

/**
 * Order validation rules
 */
const orderValidation = {
    addToCart: [
        body('idXe').isInt({ min: 1 }).withMessage('ID xe không hợp lệ'),
        body('thoiGianBatDau').isISO8601().toDate().withMessage('Thời gian bắt đầu không hợp lệ'),
        body('thoiGianKetThuc').isISO8601().toDate().withMessage('Thời gian kết thúc không hợp lệ'),
        body('soGioThue').isInt({ min: 0 }).withMessage('Số giờ thuê phải là số dương'),
        body('soNgayThue').isInt({ min: 0 }).withMessage('Số ngày thuê phải là số dương'),
        // Custom validation to ensure at least one rental period
        body().custom((value, { req }) => {
            if (req.body.soGioThue === 0 && req.body.soNgayThue === 0) {
                throw new Error('Phải chọn ít nhất 1 giờ hoặc 1 ngày thuê');
            }
            return true;
        }),
        // Custom validation for date range
        body().custom((value, { req }) => {
            const start = new Date(req.body.thoiGianBatDau);
            const end = new Date(req.body.thoiGianKetThuc);
            if (start >= end) {
                throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu');
            }
            if (start < new Date()) {
                throw new Error('Thời gian bắt đầu không thể trong quá khứ');
            }
            return true;
        }),
        handleValidationErrors,
    ],

    payment: [
        body('listDonHang').isArray({ min: 1 }).withMessage('Danh sách đơn hàng không được trống'),
        body('listDonHang.*').isInt({ min: 1 }).withMessage('ID đơn hàng không hợp lệ'),
        handleValidationErrors,
    ],
};

/**
 * Common validation rules
 */
const commonValidation = {
    id: [param('id').isInt({ min: 1 }).withMessage('ID không hợp lệ'), handleValidationErrors],

    pagination: [
        query('page').optional().isInt({ min: 1 }).withMessage('Trang phải là số dương'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit phải từ 1-100'),
        query('search')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Từ khóa tìm kiếm không quá 100 ký tự'),
        handleValidationErrors,
    ],
};

module.exports = {
    userValidation,
    carValidation,
    orderValidation,
    commonValidation,
    handleValidationErrors,
};
