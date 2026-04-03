'use strict';
const { sequelize } = require('../config/connectDB');
const { Op } = require('sequelize');
const DonHang = require('../models/DonHang');
const DonHangXe = require('../models/DonHangXe');
const Xe = require('../models/Xe');
const KhuyenMai = require('../models/KhuyenMai');
const ApiError = require('../utils/ApiError');

class BookingCreateService {
    async createNewBooking(bookingData, maNguoiDung) {
        const transaction = await sequelize.transaction();

        try {
            const { maXe, thoiGianBatDau, thoiGianKetThuc, ghiChu, maKhuyenMai } = bookingData;

            const xe = await this.checkCarAvailability(maXe, transaction);
            const { startDate, endDate, soNgayThue } = await this.validateBookingTime(
                thoiGianBatDau,
                thoiGianKetThuc
            );

            await this.checkCarBookingConflict(maXe, startDate, endDate, transaction);

            const { totalRentalFee, depositFee, discountAmount } = await this.calculateBookingFees(
                xe,
                soNgayThue,
                maKhuyenMai,
                transaction
            );

            const booking = await this.createBookingRecord(
                maNguoiDung,
                maKhuyenMai,
                totalRentalFee,
                depositFee,
                ghiChu,
                startDate,
                endDate,
                transaction
            );

            await this.linkCarToBooking(booking.maDonHang, maXe, transaction);
            await transaction.commit();

            return {
                success: true,
                message: 'Đặt xe thành công',
                data: {
                    ...booking.toJSON(),
                    xe: {
                        maXe: xe.maXe,
                        tenXe: xe.tenXe,
                        bienSo: xe.bienSo,
                        hangXe: xe.hangXe,
                        dongXe: xe.dongXe,
                        giaThue: xe.giaThue,
                    },
                    totalRentalFee,
                    depositFee,
                    discountAmount,
                },
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

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

        const soNgayThue = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        return { startDate, endDate, soNgayThue };
    }

    async checkCarBookingConflict(maXe, startDate, endDate, transaction) {
        const overlappingBookings = await DonHangXe.findAll({
            where: {
                maXe,
            },
            include: [
                {
                    model: DonHang,
                    where: {
                        trangThai: {
                            [Op.notIn]: ['da_tra', 'da_huy'],
                        },
                        thoiGianBatDau: { [Op.lte]: endDate },
                        thoiGianKetThuc: { [Op.gte]: startDate },
                    },
                },
            ],
            transaction,
        });

        if (overlappingBookings.length > 0) {
            throw new ApiError(400, 'Xe đã được đặt trong khoảng thời gian này');
        }
    }

    async calculateBookingFees(xe, soNgayThue, maKhuyenMai, transaction) {
        let totalRentalFee = soNgayThue * xe.giaThue;
        let discountAmount = 0;

        if (maKhuyenMai) {
            const khuyenMai = await KhuyenMai.findByPk(maKhuyenMai, { transaction });

            if (khuyenMai && khuyenMai.trangThai === 'kich_hoat') {
                const now = new Date();
                const ngayBatDau = new Date(khuyenMai.ngayBatDau);
                const ngayKetThuc = new Date(khuyenMai.ngayKetThuc);

                if (now >= ngayBatDau && now <= ngayKetThuc) {
                    discountAmount = (khuyenMai.phanTramGiam / 100) * totalRentalFee;
                    if (discountAmount > khuyenMai.giamToiDa) {
                        discountAmount = khuyenMai.giamToiDa;
                    }
                    totalRentalFee -= discountAmount;
                }
            }
        }

        const depositFee = Math.ceil(totalRentalFee * 0.3);

        return { totalRentalFee, depositFee, discountAmount };
    }

    async createBookingRecord(
        maNguoiDung,
        maKhuyenMai,
        totalRentalFee,
        depositFee,
        ghiChu,
        startDate,
        endDate,
        transaction
    ) {
        return DonHang.create(
            {
                maNguoiDung,
                maKhuyenMai: maKhuyenMai || null,
                daThanhToan: false,
                daDatCoc: false,
                phiThueXe: totalRentalFee,
                phiDatCoc: depositFee,
                phiTraMuon: 0,
                ghiChu,
                trangThai: 'cho_xac_nhan',
                thoiGianBatDau: startDate,
                thoiGianKetThuc: endDate,
            },
            { transaction }
        );
    }

    async linkCarToBooking(maDonHang, maXe, transaction) {
        await DonHangXe.create(
            {
                maDonHang,
                maXe,
            },
            { transaction }
        );

        const xe = await Xe.findByPk(maXe, { transaction });
        await xe.update({ trangThai: 'da_dat' }, { transaction });
    }
}

module.exports = new BookingCreateService();
