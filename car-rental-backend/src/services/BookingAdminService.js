"use strict";
const { sequelize } = require('../config/connectDB');
const DonHang = require('../models/DonHang');
const DonHangXe = require('../models/DonHangXe');
const Xe = require('../models/Xe');
const NguoiDung = require('../models/NguoiDung');
const KhuyenMai = require('../models/KhuyenMai');
const ApiError = require('../utils/ApiError');

// Service chuyên xử lý các thao tác quản lý đơn hàng (dành cho admin)
class BookingAdminService {
    // Admin xác nhận đơn hàng
    async confirmBooking(maDonHang) {
        const t = await sequelize.transaction();
        
        try {
            const donHang = await DonHang.findByPk(maDonHang, { transaction: t });
            
            if (!donHang) {
                await t.rollback();
                throw new ApiError(404, 'Không tìm thấy thông tin đơn hàng');
            }
            
            // Kiểm tra trạng thái hiện tại
            if (donHang.trangThai !== 'cho_xac_nhan') {
                await t.rollback();
                throw new ApiError(400, 'Không thể xác nhận đơn hàng với trạng thái hiện tại');
            }
            
            // Cập nhật trạng thái đơn hàng
            await donHang.update({ trangThai: 'da_xac_nhan' }, { transaction: t });
            
            // Commit transaction
            await t.commit();
            
            return donHang;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    
    // Admin cập nhật trạng thái đơn hàng thành đang thuê
    async startRental(maDonHang) {
        const t = await sequelize.transaction();
        
        try {
            const donHang = await DonHang.findByPk(maDonHang, { transaction: t });
            
            if (!donHang) {
                await t.rollback();
                throw new ApiError(404, 'Không tìm thấy thông tin đơn hàng');
            }
            
            // Kiểm tra trạng thái hiện tại
            if (donHang.trangThai !== 'da_xac_nhan') {
                await t.rollback();
                throw new ApiError(400, 'Không thể bắt đầu thuê xe với trạng thái hiện tại');
            }
            
            // Kiểm tra đã đặt cọc chưa
            if (!donHang.daDatCoc) {
                await t.rollback();
                throw new ApiError(400, 'Khách hàng chưa đặt cọc');
            }
            
            // Cập nhật trạng thái đơn hàng
            await donHang.update({ trangThai: 'dang_thue' }, { transaction: t });
            
            // Commit transaction
            await t.commit();
            
            return donHang;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    
    // Admin cập nhật trạng thái đơn hàng thành đã trả
    async completeRental(maDonHang, phiTraMuon, ghiChuTraXe) {
        const t = await sequelize.transaction();
        
        try {
            const donHang = await DonHang.findByPk(maDonHang, { transaction: t });
            
            if (!donHang) {
                await t.rollback();
                throw new ApiError(404, 'Không tìm thấy thông tin đơn hàng');
            }
            
            // Kiểm tra trạng thái hiện tại
            if (donHang.trangThai !== 'dang_thue') {
                await t.rollback();
                throw new ApiError(400, 'Không thể hoàn thành đơn thuê xe với trạng thái hiện tại');
            }
            
            // Cập nhật thông tin trả xe
            const thoiGianTraXeThucTe = new Date();
            
            // Cập nhật đơn hàng
            await donHang.update({
                trangThai: 'da_tra',
                thoiGianTraXeThucTe,
                phiTraMuon: phiTraMuon || 0,
                ghiChuTraXe,
                daThanhToan: true
            }, { transaction: t });
            
            // Lấy các xe liên quan đến đơn hàng
            const donHangXeList = await DonHangXe.findAll({
                where: { maDonHang: donHang.maDonHang },
                transaction: t
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
    
    // Admin cập nhật trạng thái đặt cọc
    async updateDeposit(maDonHang) {
        try {
            const donHang = await DonHang.findByPk(maDonHang);
            
            if (!donHang) {
                throw new ApiError(404, 'Không tìm thấy thông tin đơn hàng');
            }
            
            // Cập nhật trạng thái đặt cọc
            await donHang.update({ daDatCoc: true });
            
            return donHang;
        } catch (error) {
            throw error;
        }
    }
    
    // Admin lấy tất cả đơn hàng
    async getAllBookings(trangThai, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            // Xây dựng điều kiện tìm kiếm
            const where = {};
            if (trangThai) {
                where.trangThai = trangThai;
            }
            
            const { count, rows } = await DonHang.findAndCountAll({
                where,
                include: [
                    {
                        model: DonHangXe,
                        include: [
                            {
                                model: Xe,
                                attributes: ['maXe', 'tenXe', 'bienSo', 'hangXe', 'dongXe', 'hinhAnh']
                            }
                        ]
                    },
                    {
                        model: NguoiDung,
                        attributes: ['maNguoiDung', 'hoTen', 'email', 'soDienThoai']
                    },
                    {
                        model: KhuyenMai,
                        attributes: ['maKhuyenMai', 'tenKhuyenMai', 'phanTramGiam']
                    }
                ],
                order: [['thoiGianTao', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
            
            return {
                success: true,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                data: rows
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BookingAdminService();
