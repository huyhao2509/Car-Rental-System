'use strict';
const { sequelize } = require('../config/connectDB');
const DonHang = require('../models/DonHang');
const DonHangXe = require('../models/DonHangXe');
const Xe = require('../models/Xe');
const ApiError = require('../utils/ApiError');

// Service chuyên xử lý các thao tác cập nhật đơn hàng (dành cho người dùng)
class BookingUpdateService {
    // Hủy đơn hàng
    async cancelBooking(maDonHang, maNguoiDung) {
        const t = await sequelize.transaction();

        try {
            const donHang = await DonHang.findByPk(maDonHang, { transaction: t });

            if (!donHang) {
                await t.rollback();
                throw new ApiError(404, 'Không tìm thấy thông tin đơn hàng');
            }

            // Kiểm tra quyền hủy đơn (chỉ người đặt có thể hủy)
            if (donHang.maNguoiDung !== maNguoiDung) {
                await t.rollback();
                throw new ApiError(403, 'Bạn không có quyền hủy đơn hàng này');
            }

            // Kiểm tra trạng thái hiện tại có thể hủy không
            if (donHang.trangThai !== 'cho_xac_nhan' && donHang.trangThai !== 'da_xac_nhan') {
                await t.rollback();
                throw new ApiError(400, 'Không thể hủy đơn hàng với trạng thái hiện tại');
            }

            // Cập nhật trạng thái đơn hàng
            await donHang.update({ trangThai: 'da_huy' }, { transaction: t });

            // Lấy các xe liên quan đến đơn hàng
            const donHangXeList = await DonHangXe.findAll({
                where: { maDonHang: donHang.maDonHang },
                transaction: t,
            });

            // Cập nhật trạng thái các xe thành sẵn sàng
            for (const donHangXe of donHangXeList) {
                const xe = await Xe.findByPk(donHangXe.maXe, { transaction: t });
                if (xe) {
                    await xe.update({ trangThai: 'san_sang' }, { transaction: t });
                }
            }

            // Commit transaction
            await t.commit();

            return donHang;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

module.exports = new BookingUpdateService();
