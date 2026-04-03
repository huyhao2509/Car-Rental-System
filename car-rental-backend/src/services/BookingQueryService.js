'use strict';
const DonHang = require('../models/DonHang');
const DonHangXe = require('../models/DonHangXe');
const Xe = require('../models/Xe');
const NguoiDung = require('../models/NguoiDung');
const KhuyenMai = require('../models/KhuyenMai');
const ApiError = require('../utils/ApiError');

// Service chuyên xử lý các thao tác truy vấn thông tin đơn hàng
class BookingQueryService {
    // Lấy danh sách đơn đặt xe của người dùng
    async getUserBookings(maNguoiDung) {
        try {
            const danhSachDonHang = await DonHang.findAll({
                where: {
                    maNguoiDung,
                },
                include: [
                    {
                        model: DonHangXe,
                        include: [
                            {
                                model: Xe,
                                attributes: [
                                    'maXe',
                                    'tenXe',
                                    'bienSo',
                                    'hangXe',
                                    'dongXe',
                                    'hinhAnh',
                                    'giaThue',
                                ],
                            },
                        ],
                    },
                    {
                        model: KhuyenMai,
                        attributes: ['maKhuyenMai', 'tenKhuyenMai', 'phanTramGiam'],
                    },
                ],
                order: [['thoiGianTao', 'DESC']],
            });

            return danhSachDonHang;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết đơn hàng theo ID
    async getBookingDetail(maDonHang, maNguoiDung, isAdmin) {
        try {
            const donHang = await DonHang.findByPk(maDonHang, {
                include: [
                    {
                        model: DonHangXe,
                        include: [
                            {
                                model: Xe,
                                attributes: [
                                    'maXe',
                                    'tenXe',
                                    'bienSo',
                                    'hangXe',
                                    'dongXe',
                                    'hinhAnh',
                                    'giaThue',
                                    'moTa',
                                ],
                            },
                        ],
                    },
                    {
                        model: NguoiDung,
                        attributes: ['maNguoiDung', 'hoTen', 'email', 'soDienThoai'],
                    },
                    {
                        model: KhuyenMai,
                        attributes: ['maKhuyenMai', 'tenKhuyenMai', 'phanTramGiam', 'giamToiDa'],
                    },
                ],
            });

            if (!donHang) {
                throw new ApiError(404, 'Không tìm thấy thông tin đơn hàng');
            }

            // Kiểm tra quyền truy cập (chỉ người đặt hoặc admin có thể xem)
            if (donHang.maNguoiDung !== maNguoiDung && !isAdmin) {
                throw new ApiError(403, 'Bạn không có quyền xem thông tin đơn hàng này');
            }

            return donHang;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BookingQueryService();
