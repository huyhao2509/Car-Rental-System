const Controller = require('./Controller');
const { DonHang, ChiTietDonHang, Xe, HangXe, LoaiXe, NguoiDung, KhuyenMai, DanhGia } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const moment = require('moment');
const vnpayConfig = require('../../vnpay.config');
const qs = require('qs');
const dateFormat = require('dateformat');
const vnpay = require('vnpay');

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
                            [Op.notIn]: [0, 3]
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

            const xe = await Xe.findByPk(req.body.idXe);
            if (!xe) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy xe với id đã chọn'
                });
            }
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

            const danhSachDonHang = await DonHang.findAll({
                where: {
                    id: { [Op.in]: req.body.listDonHang }
                }
            });

            const amount = danhSachDonHang.reduce((total, donHang) => {
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
                vnp_TmnCode: "NJJ0R8FS",
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
            vnp_Params['vnp_BankCode'] = "NCB";
            vnp_Params = this.sortObject(vnp_Params);

            const signData = qs.stringify(vnp_Params, { encode: false });
            const hmac = crypto.createHmac('sha512', "BYKJBHPPZKQMKBIBGGXIYKWYFAYSJXCW");
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

    async createPaymentUrlVNPay(req, res) {
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
                return total + donHang.thanhTien;
            }, 0);

            let locale = 'vn';
            let currCode = 'VND';
            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');
            let orderId = moment(date).format('DDHHmmss');

            // Sử dụng thư viện vnpay.js.org để build URL
            const vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: 'WDDPOL18',
                vnp_Locale: locale,
                vnp_CurrCode: currCode,
                vnp_TxnRef: orderId,
                vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
                vnp_OrderType: 'other',
                vnp_Amount: (amount * 100).toString(),
                vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
                vnp_IpAddr: ipAddr,
                vnp_CreateDate: createDate,
                vnp_BankCode: 'VNBANK'
            };

            // Build URL bằng vnpay.js.org
            const paymentUrl = vnpay.buildCheckoutUrl(
                vnp_Params,
                'MAD4SA08JZR9WMBTB2CATVM585TXZF2G',
                'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
            );

            return res.status(200).json({
                status: true,
                data: { paymentUrl }
            });
        } catch (error) {
            console.log('Lỗi khi tạo URL thanh toán VNPay:', error);
            return res.status(500).json({
                status: false,
                message: 'Đã xảy ra lỗi khi tạo URL thanh toán VNPay',
                error: error.message
            });
        }
    }

    // Hàm xác thực callback từ VNPay (ReturnUrl)
    async vnpayReturn(req, res) {
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHash'];
            const isValid = vnpay.validateReturnUrl(vnp_Params, 'MAD4SA08JZR9WMBTB2CATVM585TXZF2G', secureHash);
            if (isValid) {
                // Xử lý logic thành công, ví dụ: cập nhật trạng thái đơn hàng
                return res.send('Thanh toán thành công!');
            } else {
                return res.send('Chữ ký không hợp lệ!');
            }
        } catch (error) {
            return res.status(500).send('Lỗi xử lý callback VNPay');
        }
    }

    // Hàm xác thực callback IPN từ VNPay
    async vnpayIpn(req, res) {
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHash'];
            const isValid = vnpay.validateIpnUrl(vnp_Params, 'MAD4SA08JZR9WMBTB2CATVM585TXZF2G', secureHash);
            if (isValid) {
                // Xử lý logic cập nhật trạng thái đơn hàng
                return res.json({ RspCode: '00', Message: 'Confirm Success' });
            } else {
                return res.json({ RspCode: '97', Message: 'Invalid signature' });
            }
        } catch (error) {
            return res.status(500).json({ RspCode: '99', Message: 'Lỗi xử lý IPN VNPay' });
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
            if (!donHang) {
                return res.status(400).json({
                    status: false,
                    message: 'Không tìm thấy đơn hàng'
                });
            }

            donHang.trangThai = req.body.trangThai;
            await donHang.save();

            res.status(200).json({
                status: true,
                message: 'Cập nhật trạng thái đơn hàng thành công',
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHistoryByUser(req, res) {
        try {
            const idNguoiDung = req.user.id;
            const donHangList = await DonHang.findAll({
                where: {
                    idNguoiDung,
                    trangThai: {
                        [Op.ne]: 0
                    }
                },
                include: [{
                    model: ChiTietDonHang,
                    include: [{
                        model: Xe,
                        include: [
                            { model: HangXe, attributes: ['tenHangXe'] },
                            { model: LoaiXe, attributes: ['tenLoaiXe'] }
                        ]
                    }]
                }],
                order: [['thoiGianTao', 'DESC']] // Sắp xếp theo thời gian tạo giảm dần (mới nhất lên đầu)
            });

            return res.status(200).json({
                status: true,
                message: 'Lấy lịch sử đơn hàng thành công',
                data: donHangList
            });
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
            return res.status(500).json({
                status: false,
                message: 'Đã xảy ra lỗi khi lấy lịch sử đơn hàng',
                error: error.message
            });
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

    async getMaKhuyenMai(req, res) {
        try {
            const maKhuyenMai = req.body.maKhuyenMai;
            const khuyenMai = await KhuyenMai.findOne({
                where: { maKhuyenMai }
            });
            if (!khuyenMai) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy mã khuyến mãi'
                });
            }
            return res.status(200).json({
                status: true,
                data: khuyenMai
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async dashboardStats(req, res) {
        try {
            const { Xe, DonHang, NguoiDung, Sequelize } = require('../models');
            const { Op } = Sequelize;

            const totalCars = await Xe.count();
            const availableCars = await Xe.count({
                where: {
                    trangThai: 1
                }
            });

            const totalCustomers = await NguoiDung.count({
                where: {
                    idChucVu: 2
                }
            });

            const pendingOrders = await DonHang.count({
                where: {
                    trangThai: 1
                }
            });

            const totalRevenueResult = await DonHang.sum('thanhTien', {
                where: {
                    trangThai: 2
                }
            });
            const totalRevenue = totalRevenueResult || 0;

            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            const monthlyRevenueResult = await DonHang.sum('thanhTien', {
                where: {
                    trangThai: 2,
                    thoiGianTao: {
                        [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                    }
                }
            });
            const monthlyRevenue = monthlyRevenueResult || 0;

            // Lấy doanh thu tháng trước
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            const lastMonthRevenueResult = await DonHang.sum('thanhTien', {
                where: {
                    trangThai: 2,
                    thoiGianTao: {
                        [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth]
                    }
                }
            });
            const lastMonthRevenue = lastMonthRevenueResult || 0;

            const monthlyRevenueData = [];
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            for (let i = 5; i >= 0; i--) {
                const month = (currentMonth - i + 12) % 12;
                const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0, 23, 59, 59);

                const monthRevenue = await DonHang.sum('thanhTien', {
                    where: {
                        trangThai: 2,
                        thoiGianTao: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    }
                }) || 0;

                const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

                monthlyRevenueData.push({
                    month: monthNames[month],
                    value: monthRevenue
                });
            }

            const confirmedOrders = await DonHang.count({
                where: {
                    trangThai: 2
                }
            });

            const completedOrders = await DonHang.count({
                where: {
                    trangThai: 4
                }
            });

            const cancelledOrders = await DonHang.count({
                where: {
                    trangThai: 3
                }
            });

            // Lấy thông tin về xe được thuê nhiều nhất
            // ChiTietDonHang đã được import với các model khác ở đầu phương thức

            // Query xe được thuê nhiều nhất
            const topRentedCarsResult = await ChiTietDonHang.findAll({
                attributes: [
                    'idXe',
                    [Sequelize.fn('COUNT', Sequelize.col('idXe')), 'rentCount']
                ],
                include: [{
                    model: Xe,
                    attributes: ['tenXe']
                }],
                group: ['idXe', 'Xe.id'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('idXe')), 'DESC']],
                limit: 5
            });

            // Lấy xe được thuê nhiều nhất trong hệ thống
            let topRentedCars = [];
            if (topRentedCarsResult && topRentedCarsResult.length > 0) {
                const maxRentCount = Math.max(...topRentedCarsResult.map(car => parseInt(car.dataValues.rentCount)));

                topRentedCars = topRentedCarsResult.map(car => {
                    const rentCount = parseInt(car.dataValues.rentCount);
                    return {
                        id: car.idXe,  // Sửa từ car.maXe thành car.idXe
                        name: car.Xe ? car.Xe.tenXe : 'Không xác định',
                        rentCount: rentCount,
                        percentage: Math.round((rentCount / maxRentCount) * 100)
                    };
                });
            }

            // Lấy danh sách đơn hàng gần đây
            const recentOrders = await DonHang.findAll({
                limit: 10,
                order: [['thoiGianTao', 'DESC']],
                include: [
                    { model: NguoiDung, attributes: ['hoTen', 'email', 'soDienThoai'] },
                    {
                        model: ChiTietDonHang,
                        include: [{ model: Xe, attributes: ['tenXe', 'bienSoXe'] }]
                    }
                ]
            });

            const stats = {
                totalCars,
                availableCars,
                totalCustomers,
                pendingOrders,
                confirmedOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue,
                monthlyRevenue,
                lastMonthRevenue,
                topRentedCars,
                monthlyRevenueData,
                recentOrders
            };

            res.json({ status: true, data: stats });
        } catch (err) {
            console.error('Lỗi lấy số liệu dashboard:', err);
            res.status(500).json({ status: false, message: 'Lỗi lấy số liệu dashboard', error: err.message });
        }
    }

    async getReports(req, res) {
        try {
            const { Xe, DonHang, NguoiDung, ChiTietDonHang, LoaiXe, Sequelize } = require('../models');
            const { Op } = Sequelize;
            const { period = 'month', year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
            
            // Lấy thông tin doanh thu theo tháng cho cả năm hiện tại
            const currentYear = parseInt(year);
            const monthlyRevenueData = [];
            
            for (let i = 1; i <= 12; i++) {
                const firstDay = new Date(currentYear, i - 1, 1);
                const lastDay = new Date(currentYear, i, 0, 23, 59, 59);
                
                const monthlyRevenue = await DonHang.sum('thanhTien', {
                    where: {
                        trangThai: {
                            [Op.in]: [2, 4] // Đã thanh toán hoặc hoàn thành
                        },
                        thoiGianTao: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    }
                }) || 0;
                
                const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                
                monthlyRevenueData.push({
                    name: monthNames[i - 1],
                    value: monthlyRevenue
                });
            }
            
            // Tính dữ liệu tăng trưởng
            const growthData = [];
            const previousYear = currentYear - 1;
            
            for (let i = 1; i <= 12; i++) {
                const currentMonthFirstDay = new Date(currentYear, i - 1, 1);
                const currentMonthLastDay = new Date(currentYear, i, 0, 23, 59, 59);
                
                const previousMonthFirstDay = new Date(previousYear, i - 1, 1);
                const previousMonthLastDay = new Date(previousYear, i, 0, 23, 59, 59);
                
                const currentMonthRevenue = await DonHang.sum('thanhTien', {
                    where: {
                        trangThai: {
                            [Op.in]: [2, 4] // Đã thanh toán hoặc hoàn thành
                        },
                        thoiGianTao: {
                            [Op.between]: [currentMonthFirstDay, currentMonthLastDay]
                        }
                    }
                }) || 0;
                
                const previousMonthRevenue = await DonHang.sum('thanhTien', {
                    where: {
                        trangThai: {
                            [Op.in]: [2, 4] // Đã thanh toán hoặc hoàn thành
                        },
                        thoiGianTao: {
                            [Op.between]: [previousMonthFirstDay, previousMonthLastDay]
                        }
                    }
                }) || 0;
                
                let growthPercentage = 0;
                if (previousMonthRevenue > 0) {
                    growthPercentage = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
                }
                
                const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                
                growthData.push({
                    name: monthNames[i - 1],
                    value: parseFloat(growthPercentage.toFixed(1))
                });
            }
            
            // Lấy phân bố loại xe được thuê
            const carTypeData = await ChiTietDonHang.findAll({
                attributes: [
                    [Sequelize.col('Xe.LoaiXe.tenLoaiXe'), 'name'],
                    [Sequelize.fn('COUNT', Sequelize.col('ChiTietDonHang.id')), 'count']
                ],
                include: [{
                    model: Xe,
                    required: true,
                    attributes: [],
                    include: [{
                        model: LoaiXe,
                        required: true,
                        attributes: []
                    }]
                }],
                group: ['Xe.LoaiXe.tenLoaiXe'],
                raw: true
            });
            
            // Chuyển đổi dữ liệu loại xe
            const totalTypeCount = carTypeData.reduce((sum, type) => sum + parseInt(type.count), 0);
            const formattedCarTypeData = carTypeData.map(type => ({
                name: type.name || 'Không xác định',
                value: totalTypeCount > 0 ? Math.round((parseInt(type.count) / totalTypeCount) * 100) : 0
            }));
            
            // Lấy thông tin thời gian thuê
            const rentalDurations = await ChiTietDonHang.findAll({
                attributes: [
                    [Sequelize.literal(`
                        CASE 
                            WHEN soNgayThue = 1 THEN '1 ngày'
                            WHEN soNgayThue BETWEEN 2 AND 3 THEN '2-3 ngày'
                            WHEN soNgayThue BETWEEN 4 AND 7 THEN '4-7 ngày'
                            WHEN soNgayThue BETWEEN 8 AND 14 THEN '1-2 tuần'
                            ELSE 'Trên 2 tuần'
                        END
                    `), 'duration_category'],
                    [Sequelize.fn('COUNT', Sequelize.col('ChiTietDonHang.id')), 'count']
                ],
                group: ['duration_category'],
                raw: true
            });
            
            // Chuyển đổi dữ liệu thời gian thuê
            const totalDurationCount = rentalDurations.reduce((sum, duration) => sum + parseInt(duration.count), 0);
            const rentalDurationData = rentalDurations.map(duration => ({
                name: duration.duration_category,
                value: totalDurationCount > 0 ? Math.round((parseInt(duration.count) / totalDurationCount) * 100) : 0
            }));
            
            // Thống kê tổng hợp
            const totalRentals = await DonHang.count();
            
            const totalRevenueResult = await DonHang.sum('thanhTien', {
                where: {
                    trangThai: {
                        [Op.in]: [2, 4] // Đã thanh toán hoặc hoàn thành
                    }
                }
            });
            const totalRevenue = totalRevenueResult || 0;
            
            // Tính giá trung bình mỗi đơn thuê
            const averageRevenueResult = await DonHang.findOne({
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('thanhTien')), 'averageRental']
                ],
                where: {
                    trangThai: {
                        [Op.in]: [2, 4] // Đã thanh toán hoặc hoàn thành
                    }
                },
                raw: true
            });
            const averageRentalPrice = averageRevenueResult?.averageRental || 0;
            
            // Tính tỷ lệ hoàn thành đơn hàng
            const completedOrders = await DonHang.count({
                where: {
                    trangThai: 4 // Hoàn thành
                }
            });
            
            const completionRate = totalRentals > 0 ? Math.round((completedOrders / totalRentals) * 100) : 0;
            
            // Tính tỷ lệ hủy đơn hàng
            const cancelledOrders = await DonHang.count({
                where: {
                    trangThai: 3 // Đã hủy
                }
            });
            
            const cancellationRate = totalRentals > 0 ? Math.round((cancelledOrders / totalRentals) * 100) : 0;
            
            // Lấy xe được thuê nhiều nhất
            const mostRentedCarResult = await ChiTietDonHang.findAll({
                attributes: [
                    'idXe',
                    [Sequelize.fn('COUNT', Sequelize.col('idXe')), 'rentCount']
                ],
                include: [{
                    model: Xe,
                    attributes: ['tenXe']
                }],
                group: ['idXe', 'Xe.id'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('idXe')), 'DESC']],
                limit: 1
            });
            
            const mostRentedCar = mostRentedCarResult.length > 0 ? 
                mostRentedCarResult[0].Xe.tenXe : 'Không có dữ liệu';
            
            // Lấy khách hàng hoạt động nhiều nhất
            const mostActiveCustomerResult = await DonHang.findAll({
                attributes: [
                    'idNguoiDung',
                    [Sequelize.fn('COUNT', Sequelize.col('idNguoiDung')), 'orderCount']
                ],
                include: [{
                    model: NguoiDung,
                    attributes: ['hoTen']
                }],
                group: ['idNguoiDung', 'NguoiDung.id'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('idNguoiDung')), 'DESC']],
                limit: 1
            });
            
            const mostActiveCustomer = mostActiveCustomerResult.length > 0 ? 
                mostActiveCustomerResult[0].NguoiDung.hoTen : 'Không có dữ liệu';
            
            // Thống kê tổng hợp
            const summaryStats = {
                totalRentals,
                totalRevenue,
                averageRentalPrice,
                mostRentedCar,
                mostActiveCustomer,
                completionRate,
                cancellationRate
            };
            
            // Top xe được thuê nhiều nhất
            const topCarsDataResult = await ChiTietDonHang.findAll({
                attributes: [
                    'idXe',
                    [Sequelize.fn('COUNT', Sequelize.col('idXe')), 'rentCount'],
                    [Sequelize.fn('SUM', Sequelize.col('donGia')), 'revenue']
                ],
                include: [{
                    model: Xe,
                    attributes: ['tenXe', 'id']
                }],
                group: ['idXe', 'Xe.id'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('idXe')), 'DESC']],
                limit: 5
            });
            
            // Chuyển đổi dữ liệu top xe
            const topCarsData = await Promise.all(topCarsDataResult.map(async (car) => {
                // Lấy đánh giá trung bình cho xe này
                const avgRatingResult = await ChiTietDonHang.findOne({
                    attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('DanhGium.soSao')), 'avgRating']
                    ],
                    where: {
                        idXe: car.idXe
                    },
                    include: [{
                        model: DanhGia,
                        required: false,
                        attributes: []
                    }],
                    raw: true
                });
                
                const avgRating = avgRatingResult?.avgRating || 0;
                
                // Tính tăng trưởng cho xe này
                const currentMonthFirstDay = new Date(currentYear, month - 1, 1);
                const currentMonthLastDay = new Date(currentYear, month, 0, 23, 59, 59);
                
                const prevMonthFirstDay = new Date(currentYear, month - 2, 1);
                const prevMonthLastDay = new Date(currentYear, month - 1, 0, 23, 59, 59);
                
                const currentMonthCount = await ChiTietDonHang.count({
                    where: {
                        idXe: car.idXe,
                        thoiGianTao: {
                            [Op.between]: [currentMonthFirstDay, currentMonthLastDay]
                        }
                    }
                });
                
                const prevMonthCount = await ChiTietDonHang.count({
                    where: {
                        idXe: car.idXe,
                        thoiGianTao: {
                            [Op.between]: [prevMonthFirstDay, prevMonthLastDay]
                        }
                    }
                });
                
                let growth = 0;
                if (prevMonthCount > 0) {
                    growth = Math.round(((currentMonthCount - prevMonthCount) / prevMonthCount) * 100);
                }
                
                return {
                    id: car.Xe.id,
                    name: car.Xe.tenXe,
                    rentCount: parseInt(car.dataValues.rentCount),
                    revenue: parseInt(car.dataValues.revenue),
                    avgRating: parseFloat(avgRating).toFixed(1),
                    growth
                };
            }));
            
            const reportsData = {
                monthlyRevenueData,
                growthData,
                carTypeData: formattedCarTypeData,
                rentalDurationData,
                summaryStats,
                topCarsData
            };
            
            res.json({ status: true, data: reportsData });
        } catch (err) {
            console.error('Lỗi lấy số liệu báo cáo:', err);
            res.status(500).json({ status: false, message: 'Lỗi lấy số liệu báo cáo', error: err.message });
        }
    }

    async danhGiaDonHang(req, res) {
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

            const { idDonHang, soSao, noiDung } = req.body;

            // Kiểm tra đơn hàng tồn tại và thuộc về người dùng
            const donHang = await DonHang.findOne({
                where: { 
                    id: idDonHang,
                    idNguoiDung,
                    trangThai: DonHang.DA_HOAN_THANH
                }
            });

            if (!donHang) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy đơn hàng hoặc đơn hàng chưa hoàn thành'
                });
            }

            // Lấy chi tiết đơn hàng
            const chiTietDonHang = await ChiTietDonHang.findOne({
                where: { idDonHang }
            });

            if (!chiTietDonHang) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy chi tiết đơn hàng'
                });
            }

            // Tạo đánh giá mới
            const danhGia = await DanhGia.create({
                idChiTiet: chiTietDonHang.id,
                idNguoiDung,
                soSao,
                noiDung,
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            });

            res.status(200).json({
                status: true,
                message: 'Đánh giá thành công',
                data: danhGia
            });
        } catch (error) {
            console.error('Lỗi khi đánh giá đơn hàng:', error);
            res.status(500).json({
                status: false,
                message: 'Đã xảy ra lỗi khi đánh giá đơn hàng',
                error: error.message
            });
        }
    }
}

module.exports = new DonHangController();
