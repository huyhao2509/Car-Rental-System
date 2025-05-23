const jwt = require('jsonwebtoken');
const { ChucVu, ChucNang, ChiTietPhanQuyen } = require('../models');

/**
 * Middleware xác thực token JWT
 */
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        // Xác thực token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

/**
 * Middleware kiểm tra quyền hạn
 * @param {string} permissionCode - Mã quyền cần kiểm tra (vd: THEM_LOAI_XE)
 */
const checkPermission = (permissionCode) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: false,
                    message: 'Vui lòng đăng nhập để thực hiện chức năng này'
                });
            }

            const chucVuId = req.user.idChucVu;
            
            if (chucVuId === 1) {
                return next();
            }

            const chucNang = await ChucNang.findOne({
                where: {
                    tenChucNang: permissionCode,
                    trangThai: 1
                }
            });

            if (!chucNang) {
                return res.status(403).json({
                    status: false,
                    message: 'Chức năng không tồn tại hoặc đã bị vô hiệu hóa'
                });
            }

            const hasPermission = await ChiTietPhanQuyen.findOne({
                where: {
                    idChucVu: chucVuId,
                    idChucNang: chucNang.id
                }
            });

            if (!hasPermission) {
                return res.status(403).json({
                    status: false,
                    message: 'Bạn không có quyền thực hiện chức năng này'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    };
};

module.exports = {
    verifyToken,
    checkPermission
}; 