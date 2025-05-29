const jwt = require('jsonwebtoken');
const { NguoiDung, ChucVu, ChucNang, ChiTietPhanQuyen } = require('../models');

/**
 * Middleware xác thực token JWT
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                message: 'Không tìm thấy token xác thực'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const nguoiDung = await NguoiDung.findOne({ 
            where: { id: decoded.id },
            include: ['ChucVu']
        });

        if (!nguoiDung) {
            return res.status(401).json({
                status: false,
                message: 'Người dùng không tồn tại'
            });
        }

        if (nguoiDung.trangThai !== 1) {
            return res.status(401).json({
                status: false,
                message: 'Tài khoản đã bị khóa'
            });
        }

        req.user = nguoiDung;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Token không hợp lệ hoặc đã hết hạn',
            error: error.message
        });
    }
};

/**
 * Middleware kiểm tra quyền hạn
 * @param {string} idChucNang - ID chức năng cần kiểm tra
 */
const checkPermission = (idChucNang) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    status: false,
                    message: 'Không tìm thấy token xác thực'
                });
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const idNguoiDung = decoded.id;
            const nguoiDung = await NguoiDung.findOne({ where: { id: idNguoiDung } });
            if (nguoiDung.idChucVu === 1) {
                return next();
            }

            // Kiểm tra chức năng có tồn tại và đang hoạt động
            const chucNang = await ChucNang.findOne({
                where: {
                    id: idChucNang,
                    trangThai: 1
                }
            });

            if (!chucNang) {
                return res.status(403).json({
                    status: false,
                    message: 'Chức năng không tồn tại hoặc đã bị vô hiệu hóa'
                });
            }

            // Kiểm tra quyền trong bảng chi tiết phân quyền
            const hasPermission = await ChiTietPhanQuyen.findOne({
                where: {
                    idChucVu: nguoiDung.idChucVu,
                    idChucNang: idChucNang
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
                message: 'Lỗi khi kiểm tra quyền',
                error: error.message
            });
        }
    };
};

module.exports = {
    verifyToken,
    checkPermission
}; 