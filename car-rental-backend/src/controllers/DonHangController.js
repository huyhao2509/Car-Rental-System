const Controller = require('./Controller');
const { DonHang } = require('../models');
const {
    getMonthName,
    getMonthRange,
    getRevenueByRange,
    countRecords,
    sumOrderRevenue,
    findFirstOrder,
    getXeInclude,
    getXeAdminInclude,
    getDonHangWithXeInclude,
    getDonHangWithXeAndNguoiDungInclude,
    getCustomerOrderInclude,
    getDashboardRecentOrderInclude,
    getReportCarTypeInclude,
} = require('../services/donHangQueryHelpers');
const { buildDashboardStats, buildReportsData } = require('../services/donHangReportService');
const {
    checkXeDaDat,
    checkNguoiDungCoTrungLich,
    createCartItem,
    getCartItems,
    removeCartItem,
    createPaymentOrders,
    getOrdersForCheckout,
    getAllOrdersForUser,
    getAllOrdersForAdmin,
    confirmPayment,
    updateStatus,
    getHistoryByUser,
    cancelOrder,
    getKhuyenMai,
} = require('../services/donHangCustomerService');
// const dateFormat = require('dateformat');

class DonHangController extends Controller {
    constructor() {
        super(DonHang);
    }

    getMonthNames() {
        return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    }

    getMonthName(monthIndex) {
        return getMonthName(monthIndex);
    }

    getMonthRange(year, monthIndex) {
        return getMonthRange(year, monthIndex);
    }

    async getRevenueByRange({ start, end, dateField = 'thoiGianTao', statuses = [2, 4] }) {
        return getRevenueByRange({ start, end, dateField, statuses });
    }

    async countRecords(model, where) {
        return countRecords(model, where);
    }

    async sumOrderRevenue(where) {
        return sumOrderRevenue(where);
    }

    async findFirstOrder(attributes, include, group, order, fallback = null) {
        return findFirstOrder(attributes, include, group, order, fallback);
    }

    getXeInclude() {
        return getXeInclude();
    }

    getXeAdminInclude() {
        return getXeAdminInclude();
    }

    getDonHangWithXeInclude(attributes = ['tenXe', 'hinhAnh']) {
        return getDonHangWithXeInclude(attributes);
    }

    getDonHangWithXeAndNguoiDungInclude(isAdmin = false) {
        return getDonHangWithXeAndNguoiDungInclude(isAdmin);
    }

    getCustomerOrderInclude() {
        return getCustomerOrderInclude();
    }

    getDashboardRecentOrderInclude() {
        return getDashboardRecentOrderInclude();
    }

    getReportCarTypeInclude() {
        return getReportCarTypeInclude();
    }

    handleInternalError(res, error, options = {}) {
        const {
            contextMessage = null,
            responseType = 'error-only',
            message = 'Lỗi server',
        } = options;

        if (contextMessage) {
            console.error(contextMessage, error);
        }

        if (responseType === 'status-message') {
            return res.status(500).json({
                status: false,
                message,
                error: error.message,
            });
        }

        return res.status(500).json({ error: error.message });
    }

    async checkXeDaDat(idXe, thoiGianBatDau, thoiGianKetThuc) {
        return checkXeDaDat(idXe, thoiGianBatDau, thoiGianKetThuc);
    }

    async checkNguoiDungCoTrungLich(idNguoiDung, thoiGianBatDau, thoiGianKetThuc, trangThai) {
        return checkNguoiDungCoTrungLich(idNguoiDung, thoiGianBatDau, thoiGianKetThuc, trangThai);
    }

    async themGioHang(req, res) {
        try {
            const result = await createCartItem({
                idNguoiDung: req.user.id,
                idXe: req.body.idXe,
                thoiGianBatDau: req.body.thoiGianBatDau,
                thoiGianKetThuc: req.body.thoiGianKetThuc,
                soNgayThue: req.body.soNgayThue,
                soGioThue: req.body.soGioThue,
            });

            if (!result.ok) {
                return res.status(result.status).json({
                    status: false,
                    message: result.message,
                });
            }

            res.status(200).json({
                status: true,
                message: 'Thêm vào giỏ hàng thành công',
            });
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                });
            }
            return this.handleInternalError(res, error);
        }
    }

    async layGioHang(req, res) {
        try {
            const donHang = await getCartItems(req.user.id);

            res.status(200).json({
                data: donHang,
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async xoaGioHang(req, res) {
        try {
            const result = await removeCartItem(req.params.id, req.user.id);

            if (!result.ok) {
                return res.status(result.status).json({
                    status: false,
                    message: result.message,
                });
            }

            res.status(200).json({
                status: true,
                message: 'Xóa đơn hàng thành công',
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async thanhToan(req, res) {
        try {
            const updatedOrders = await createPaymentOrders(req.user.id, req.body.listDonHang || []);
            res.status(200).json({
                status: true,
                data: updatedOrders,
                message: 'Tạo đơn hàng thành công',
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async layDonHang(req, res) {
        try {
            const { listDonHangId } = req.body;

            if (!listDonHangId || !Array.isArray(listDonHangId) || listDonHangId.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Vui lòng cung cấp danh sách ID đơn hàng hợp lệ',
                });
            }

            const danhSachDonHang = await getOrdersForCheckout(listDonHangId);

            if (danhSachDonHang.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy đơn hàng nào với ID được cung cấp',
                });
            }

            return res.status(200).json({
                status: true,
                data: danhSachDonHang,
            });
        } catch (error) {
            return this.handleInternalError(res, error, {
                contextMessage: 'Lỗi khi lấy thông tin đơn hàng:',
                responseType: 'status-message',
                message: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng',
            });
        }
    }

    async layDonHangAll(req, res) {
        try {
            const donHang = await getAllOrdersForUser();

            res.status(200).json({
                data: donHang,
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async layDonHangAllAdmin(req, res) {
        try {
            const donHang = await getAllOrdersForAdmin();
            res.status(200).json({
                status: true,
                data: donHang,
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async xacNhanThanhToan(req, res) {
        try {
            const result = await confirmPayment(req.params.id);
            if (!result.ok) {
                return res.status(result.status).json({
                    status: false,
                    message: result.message,
                });
            }
            res.status(200).json({
                status: true,
                message: 'Xác nhận thanh toán thành công',
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async capNhatTrangThai(req, res) {
        try {
            const result = await updateStatus(req.body.id, req.body.trangThai);
            if (!result.ok) {
                return res.status(result.status).json({
                    status: false,
                    message: result.message,
                });
            }

            res.status(200).json({
                status: true,
                message: 'Cập nhật trạng thái đơn hàng thành công',
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async getHistoryByUser(req, res) {
        try {
            const donHangList = await getHistoryByUser(req.user.id);

            return res.status(200).json({
                status: true,
                message: 'Lấy lịch sử đơn hàng thành công',
                data: donHangList,
            });
        } catch (error) {
            return this.handleInternalError(res, error, {
                contextMessage: 'Lỗi khi lấy lịch sử đơn hàng:',
                responseType: 'status-message',
                message: 'Đã xảy ra lỗi khi lấy lịch sử đơn hàng',
            });
        }
    }

    async huyDonHang(req, res) {
        try {
            const result = await cancelOrder(req.params.id, req.user.id);
            if (!result.ok) {
                return res.status(result.status).json({
                    status: false,
                    message: result.message,
                });
            }
            res.status(200).json({
                status: true,
                message: 'Hủy đơn hàng thành công',
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async getMaKhuyenMai(req, res) {
        try {
            const result = await getKhuyenMai(req.body.maKhuyenMai);
            if (!result.ok) {
                return res.status(result.status).json({
                    status: false,
                    message: result.message,
                });
            }
            return res.status(200).json({
                status: true,
                data: result.khuyenMai,
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async dashboardStats(req, res) {
        try {
            const stats = await buildDashboardStats();
            res.json({ status: true, data: stats });
        } catch (err) {
            return this.handleInternalError(res, err, {
                contextMessage: 'Lỗi lấy số liệu dashboard:',
                responseType: 'status-message',
                message: 'Lỗi lấy số liệu dashboard',
            });
        }
    }

    async getReports(req, res) {
        try {
            const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } =
                req.query;
            const reportsData = await buildReportsData({ year, month });
            res.json({ status: true, data: reportsData });
        } catch (err) {
            return this.handleInternalError(res, err, {
                contextMessage: 'Lỗi lấy số liệu báo cáo:',
                responseType: 'status-message',
                message: 'Lỗi lấy số liệu báo cáo',
            });
        }
    }
}

module.exports = new DonHangController();
