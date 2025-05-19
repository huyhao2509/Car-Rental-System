const Controller = require('./Controller');
const { DonHang, ChiTietDonHang, Xe, HangXe, LoaiXe, NguoiDung } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const moment = require('moment');
const vnpayConfig = require('../../vnpay.config');
const qs = require('qs');
const dateFormat = require('dateformat');

class DonHangController extends Controller {
    constructor() {
        super(DonHang);
    }

    async checkXeDaDat(idXe, thoiGianBatDau, thoiGianKetThuc) {
        try {
            const donHangCoXe = await ChiTietDonHang.findAll({
                where: { idXe },
                include: [{
                    model: DonHang,
                    where: {
                        trangThai: {
                            [Op.notIn]: [0]
                        },
                        [Op.or]: [
                            {
                                thoiGianBatDau: { [Op.lte]: thoiGianBatDau },
                                thoiGianKetThuc: { [Op.gte]: thoiGianBatDau }
                            },
                            {
                                thoiGianBatDau: { [Op.lte]: thoiGianKetThuc },
                                thoiGianKetThuc: { [Op.gte]: thoiGianKetThuc }
                            },
                            {
                                thoiGianBatDau: { [Op.gte]: thoiGianBatDau },
                                thoiGianKetThuc: { [Op.lte]: thoiGianKetThuc }
                            }
                        ]
                    }
                }]
            });

            return donHangCoXe.length > 0;
        } catch (error) {
            console.log('Lỗi khi kiểm tra xe đã đặt:', error);
            throw error;
        }
    }

    async checkNguoiDungCoTrungLich(idNguoiDung, thoiGianBatDau, thoiGianKetThuc, trangThai) {
        try {
            const donHang = await DonHang.findOne({
                where: {
                    idNguoiDung,
                    trangThai,
                    [Op.or]: [
                        {
                            thoiGianBatDau: { [Op.lte]: thoiGianBatDau },
                            thoiGianKetThuc: { [Op.gte]: thoiGianBatDau }
                        },
                        {
                            thoiGianBatDau: { [Op.lte]: thoiGianKetThuc },
                            thoiGianKetThuc: { [Op.gte]: thoiGianKetThuc }
                        },
                        {
                            thoiGianBatDau: { [Op.gte]: thoiGianBatDau },
                            thoiGianKetThuc: { [Op.lte]: thoiGianKetThuc }
                        }
                    ]
                }
            });

            return donHang !== null;
        } catch (error) {
            console.log('Lỗi khi kiểm tra lịch người dùng:', error);
            throw error;
        }
    };

    async themGioHang(req, res) {
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

            const xeDaDat = await this.checkXeDaDat(req.body.idXe, new Date(req.body.thoiGianBatDau), new Date(req.body.thoiGianKetThuc));
            if (xeDaDat) {
                return res.status(400).json({
                    status: false,
                    message: 'Xe đã được đặt trong khoảng thời gian này'
                });
            }

            // const nguoiDungCoTrungLich = await this.checkNguoiDungCoTrungLich(idNguoiDung, new Date(req.body.thoiGianBatDau), new Date(req.body.thoiGianKetThuc), 0);
            // if (nguoiDungCoTrungLich) {
            //     return res.status(400).json({
            //         status: false,
            //         message: 'Bạn đã có đơn hàng trong khoảng thời gian này'
            //     });
            // }
            const donGia = xe.giaTheoNgay * req.body.soNgayThue + xe.giaTheoGio * req.body.soGioThue;
            const donHang = await DonHang.create({
                idNguoiDung: idNguoiDung,
                thoiGianBatDau: req.body.thoiGianBatDau,
                thoiGianKetThuc: req.body.thoiGianKetThuc,
                trangThai: 0,
                tienThueXe: donGia,
                thoiGianTao: new Date(),
                thoiGianSua: new Date(),
            });

            const xe = await Xe.findByPk(req.body.idXe);

            await ChiTietDonHang.create({
                idDonHang: donHang.id,
                idXe: req.body.idXe,
                soGioThue: req.body.soGioThue,
                soNgayThue: req.body.soNgayThue,
                donGia: donGia,
                thoiGianTao: new Date(),
                thoiGianSua: new Date(),
            });

            res.status(200).json({
                status: true,
                message: 'Thêm vào giỏ hàng thành công',
            });
        } catch (error) {
            console.log('Lỗi khi thêm vào giỏ hàng:', error);
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async layGioHang(req, res) {
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

            const donHang = await DonHang.findAll({
                where: { idNguoiDung, trangThai: 0, isThanhToan: null },
                include: [{
                    model: ChiTietDonHang,
                    include: [{
                        model: Xe,
                        attributes: ['tenXe', 'hinhAnh'],
                        include: [{
                            model: HangXe,
                            attributes: ['tenHangXe']
                        }],
                        include: [{
                            model: LoaiXe,
                            attributes: ['tenLoaiXe']
                        }]
                    }]
                }]
            });

            res.status(200).json({
                data: donHang
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async xoaGioHang(req, res) {
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

            const donHang = await DonHang.findOne({
                where: { id: req.params.id, idNguoiDung }
            });

            if (!donHang) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy đơn hàng'
                });
            }

            const chiTietDonHang = await ChiTietDonHang.findOne({
                where: { idDonHang: donHang.id }
            });

            if (chiTietDonHang) {
                await chiTietDonHang.destroy();
            }

            await donHang.destroy();

            res.status(200).json({
                status: true,
                message: 'Xóa đơn hàng thành công'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async thanhToan(req, res) {
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

            const listDonHang = req.body.listDonHang;
            for (const donHang of listDonHang) {
                const donHangDetail = await DonHang.findOne({
                    where: { id: donHang, idNguoiDung }
                });
                if (donHangDetail) {
                    const thanhTien = donHangDetail.tienThueXe + donHangDetail.tienThueXe * 0.1;
                    await donHangDetail.update({
                        trangThai: DonHang.DA_TAO_DON_HANG,
                        maDonHang: "DH" + Math.floor(100000 + Math.random() * 900000),
                        thanhTien: thanhTien,
                        isThanhToan: DonHang.CHUA_THANH_TOAN_IS, // Đã tạo đơn hàng
                        phiCoc: thanhTien * 0.2,    // 20% tiền cọc
                        thoiGianSua: new Date()
                    });
                }
            }
            res.status(200).json({
                status: true,
                data: listDonHang,
                message: 'Tạo đơn hàng thành công'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async layDonHang(req, res) {
        try {
            // Kiểm tra dữ liệu đầu vào
            const { listDonHangId } = req.body;

            if (!listDonHangId || !Array.isArray(listDonHangId) || listDonHangId.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Vui lòng cung cấp danh sách ID đơn hàng hợp lệ'
                });
            }

            // Lấy thông tin đơn hàng và các thông tin liên quan
            const danhSachDonHang = await DonHang.findAll({
                where: {
                    id: { [Op.in]: listDonHangId }
                },
                include: [
                    {
                        model: ChiTietDonHang,
                        include: [
                            {
                                model: Xe,
                                attributes: ['id', 'tenXe', 'bienSoXe', 'namSanXuat', 'giaTheoGio', 'giaTheoNgay', 'hinhAnh'],
                                include: [
                                    {
                                        model: HangXe,
                                        attributes: ['id', 'tenHangXe']
                                    },
                                    {
                                        model: LoaiXe,
                                        attributes: ['id', 'tenLoaiXe']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                order: [['thoiGianTao', 'DESC']]
            });

            // Kiểm tra nếu không tìm thấy đơn hàng nào
            if (danhSachDonHang.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy đơn hàng nào với ID được cung cấp'
                });
            }

            return res.status(200).json({
                status: true,
                data: danhSachDonHang
            });
        } catch (error) {
            console.log('Lỗi khi lấy thông tin đơn hàng:', error);
            return res.status(500).json({
                status: false,
                message: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng',
                error: error.message
            });
        }
    }

    async layDonHangAll(req, res) {
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
            const donHang = await DonHang.findAll({
                where: { idNguoiDung },
                include: [
                    {
                        model: ChiTietDonHang,
                        include: [
                            {
                                model: Xe,
                                attributes: ['id', 'tenXe', 'bienSoXe', 'namSanXuat', 'giaTheoGio', 'giaTheoNgay', 'hinhAnh'],
                            }
                        ]
                    }
                ]
            });
            res.status(200).json({
                status: true,
                data: donHang
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createPaymentUrl(req, res) {
        try {
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket?.remoteAddress ||
                req.connection?.socket?.remoteAddress;

            // Lấy danh sách đơn hàng từ database
            const danhSachDonHang = await DonHang.findAll({
                where: {
                    id: { [Op.in]: req.body.listDonHang }
                }
            });

            // Tính tổng tiền từ các đơn hàng
            const amount = danhSachDonHang.reduce((total, donHang) => {
                // Tính tổng tiền = tiền thuê xe + 10% phí dịch vụ (phí dịch vụ đã được tính trong thanhTien)
                return total + donHang.thanhTien;
            }, 0);
            
            let locale = 'vn';
            let currCode = 'VND';
            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');
            let orderId = moment(date).format('DDHHmmss'); // giống mẫu

            let vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: vnpayConfig.vnp_TmnCode,
                vnp_Locale: locale,
                vnp_CurrCode: currCode,
                vnp_TxnRef: orderId,
                vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
                vnp_OrderType: 'other',
                vnp_Amount: (amount * 100).toString(),
                vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate
            };
            vnp_Params['vnp_BankCode'] = "VNBANK";
            vnp_Params = this.sortObject(vnp_Params);

            const signData = qs.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
            vnp_Params['vnp_SecureHash'] = signed;

            const paymentUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

            return res.status(200).json({
                status: true,
                data: { paymentUrl }
            });
        } catch (error) {
            console.log('Lỗi khi tạo URL thanh toán:', error);
            return res.status(500).json({
                status: false,
                message: 'Đã xảy ra lỗi khi tạo URL thanh toán',
                error: error.message
            });
        }
    }

    sortObject(obj) {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sorted[key] = obj[key];
        }
        return sorted;
    }

    queryString(obj) {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    }

    async layDonHangAllAdmin(req, res) {
        try {
            const donHang = await DonHang.findAll({
                where: {
                    trangThai: {
                        [Op.gt]: 0
                    }
                },
                include: [
                    {
                        model: ChiTietDonHang,
                        include: [
                            {
                                model: Xe,
                                attributes: ['id', 'tenXe', 'bienSoXe', 'namSanXuat', 'giaTheoGio', 'giaTheoNgay', 'hinhAnh'],
                                include: [
                                    {
                                        model: HangXe,
                                        attributes: ['id', 'tenHangXe']
                                    },
                                    {
                                        model: LoaiXe,
                                        attributes: ['id', 'tenLoaiXe']
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        model: NguoiDung,
                        attributes: ['id', 'hoTen', 'email', 'soDienThoai']
                    }
                ]
            });
            res.status(200).json({
                status: true,
                data: donHang
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async xacNhanThanhToan(req, res) {
        try {
            const donHang = await DonHang.findByPk(req.params.id);
            await donHang.update({
                trangThai: DonHang.DA_THANH_TOAN,
                thoiGianSua: new Date()
            });
            res.status(200).json({
                status: true,
                message: 'Xác nhận thanh toán thành công'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async capNhatTrangThai(req, res) {
        try {
            const donHang = await DonHang.findByPk(req.body.id);
            await donHang.update({
                trangThai: req.body.trangThai,
                thoiGianSua: new Date()
            });
            res.status(200).json({
                status: true,
                message: 'Cập nhật trạng thái thành công'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async huyDonHang(req, res) {
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
            
            const donHang = await DonHang.findOne({
                where: { id: req.params.id, idNguoiDung }
            });
            if (!donHang) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy đơn hàng'
                });
            }
            await donHang.update({
                trangThai: DonHang.DA_HUY_DON_HANG,
                thoiGianSua: new Date() 
            });
            res.status(200).json({
                status: true,
                message: 'Hủy đơn hàng thành công'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new DonHangController();
