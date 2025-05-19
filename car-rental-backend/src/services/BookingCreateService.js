"use strict";
const { sequelize } = require('../config/connectDB');
const { Op } = require('sequelize');
const DonHang = require('../models/DonHang');
const DonHangXe = require('../models/DonHangXe');
const Xe = require('../models/Xe');
const KhuyenMai = require('../models/KhuyenMai');
const ApiError = require('../utils/ApiError');

// Service chuyên xử lý việc tạo đơn đặt xe mới
class BookingCreateService {
    // Tạo đơn đặt xe mới
    async createNewBooking(bookingData, maNguoiDung) {
        const t = await sequelize.transaction(); // Bắt đầu transaction
        
        try {
            const { 
                maXe, 
                diaChiNhanXe, 
                diaChiTraXe, 
                thoiGianBatDau, 
                thoiGianKetThuc, 
                ghiChu,
                maKhuyenMai
            } = bookingData;
            
            // Kiểm tra xe tồn tại
            const xe = await this.checkCarAvailability(maXe, t);
            console.log('Xe:', xe); // Log xe for debugging
            // Kiểm tra thời gian
            const { startDate, endDate, soNgayThue } = await this.validateBookingTime(thoiGianBatDau, thoiGianKetThuc);
            console.log('Thời gian đặt xe:', startDate, endDate); // Log thời gian đặt xe for debugging
            // Kiểm tra xe đã được đặt trong khoảng thời gian này chưa
            await this.checkCarBookingConflict(maXe, startDate, endDate, t);
            
            // Tính phí thuê xe và áp dụng khuyến mãi
            const { phiThueXe, phiDatCoc, giamGia } = await this.calculateBookingFees(xe, soNgayThue, maKhuyenMai, t);
            console.log('Phí thuê xe:', phiThueXe, 'Đặt cọc:', phiDatCoc, 'Giảm giá:', giamGia); // Log phí thuê xe for debugging
            // Tạo đơn hàng mới
            const donHang = await this.createBookingRecord(
                maNguoiDung, 
                maKhuyenMai, 
                phiThueXe, 
                phiDatCoc, 
                ghiChu, 
                startDate, 
                endDate, 
                t
            );
            console.log('Đơn hàng:', donHang); // Log đơn hàng for debugging
            // Tạo liên kết với xe và cập nhật trạng thái xe
           const bb= await this.linkCarToBooking(donHang.maDonHang, maXe, t);
            console.log('Liên kết xe:', bb); // Log liên kết xe for debugging
            // Commit transaction
            await t.commit();
            
            return {
                success: true,
                message: 'Đặt xe thành công',
                data: {
                    ...donHang.toJSON(),
                    xe: {
                        maXe: xe.maXe,
                        tenXe: xe.tenXe,
                        bienSo: xe.bienSo,
                        hangXe: xe.hangXe,
                        dongXe: xe.dongXe,
                        giaThue: xe.giaThue
                    }
                }
            };
            
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    
    // Kiểm tra xe có tồn tại và sẵn sàng cho thuê
    async checkCarAvailability(maXe, transaction) {
        const xe = await Xe.findByPk(maXe, { transaction });
        
        if (!xe) {
            throw new ApiError(404, 'Không tìm thấy xe');
        }
        
        if (xe.trangThai !== 'san_sang') {
            throw new ApiError(400, 'Xe không khả dụng để cho thuê');
        }
        
        return xe;
    }
    
    // Kiểm tra thời gian đặt xe hợp lệ
    async validateBookingTime(thoiGianBatDau, thoiGianKetThuc) {
        const startDate = new Date(thoiGianBatDau);
        const endDate = new Date(thoiGianKetThuc);
        const now = new Date();
        
        if (startDate < now) {
            throw new ApiError(400, 'Thời gian bắt đầu không thể là thời điểm trong quá khứ');
        }
        
        if (startDate >= endDate) {
            throw new ApiError(400, 'Thời gian kết thúc phải sau thời gian bắt đầu');
        }
        
        // Tính số ngày thuê
        const soNgayThue = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        return { startDate, endDate, soNgayThue };
    }
    
    // Kiểm tra xe đã được đặt trong khoảng thời gian này chưa
    async checkCarBookingConflict(maXe, startDate, endDate, transaction) {
        const donHangXeHienTai = await DonHangXe.findAll({
            where: {
                maXe
            },
            include: [
                {
                    model: DonHang,
                    where: {
                        trangThai: {
                            [Op.notIn]: ['da_tra', 'da_huy']
                        },
                        [Op.or]: [
                            {
                                [Op.and]: [
                                    { thoiGianBatDau: { [Op.lte]: endDate } },
                                    { thoiGianKetThuc: { [Op.gte]: startDate } }
                                ]
                            }
                        ]
                    }
                }
            ],
            transaction
        });
        
        if (donHangXeHienTai && donHangXeHienTai.length > 0) {
            throw new ApiError(400, 'Xe đã được đặt trong khoảng thời gian này');
        }
    }
    
    // Tính phí thuê xe và áp dụng khuyến mãi
    async calculateBookingFees(xe, soNgayThue, maKhuyenMai, transaction) {
        // Tính phí thuê xe
        let phiThueXe = soNgayThue * xe.giaThue;
        let giamGia = 0;
        
        // Áp dụng khuyến mãi nếu có
        if (maKhuyenMai) {
            const khuyenMai = await KhuyenMai.findByPk(maKhuyenMai, { transaction });
            if (khuyenMai && khuyenMai.trangThai === 'kich_hoat') {
                const now = new Date();
                const ngayBatDau = new Date(khuyenMai.ngayBatDau);
                const ngayKetThuc = new Date(khuyenMai.ngayKetThuc);
                
                if (now >= ngayBatDau && now <= ngayKetThuc) {
                    giamGia = (khuyenMai.phanTramGiam / 100) * phiThueXe;
                    if (giamGia > khuyenMai.giamToiDa) {
                        giamGia = khuyenMai.giamToiDa;
                    }
                    phiThueXe -= giamGia;
                }
            }
        }
        
        // Tính tiền đặt cọc (30% tổng tiền)
        const phiDatCoc = Math.ceil(phiThueXe * 0.3);
        
        return { phiThueXe, phiDatCoc, giamGia };
    }
    
    // Tạo bản ghi đơn hàng mới
    async createBookingRecord(maNguoiDung, maKhuyenMai, phiThueXe, phiDatCoc, ghiChu, startDate, endDate, transaction) {
        return await DonHang.create({
            maNguoiDung,
            maKhuyenMai: maKhuyenMai || null,
            daThanhToan: false,
            daDatCoc: false,
            phiThueXe,
            phiDatCoc,
            phiTraMuon: 0,
            ghiChu,
            trangThai: 'cho_xac_nhan',
            thoiGianBatDau: startDate,
            thoiGianKetThuc: endDate
        }, { transaction });
    }
    
    // Tạo liên kết với xe và cập nhật trạng thái xe
    async linkCarToBooking(maDonHang, maXe, transaction) {
        // Tạo liên kết với xe
        await DonHangXe.create({
            maDonHang,
            maXe
        }, { transaction });
        
        // Cập nhật trạng thái xe
        const xe = await Xe.findByPk(maXe, { transaction });
        await xe.update({ trangThai: 'da_dat' }, { transaction });
    }
}

module.exports = new BookingCreateService();
