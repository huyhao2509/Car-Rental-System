const { Op } = require('sequelize');
const {
    DonHang,
    ChiTietDonHang,
    Xe,
    NguoiDung,
    KhuyenMai,
} = require('../models');
const {
    getDonHangWithXeInclude,
    getXeAdminInclude,
    getCustomerOrderInclude,
} = require('./donHangQueryHelpers');

async function checkXeDaDat(idXe, thoiGianBatDau, thoiGianKetThuc) {
    const donHangCoXe = await ChiTietDonHang.findAll({
        where: { idXe },
        include: [
            {
                model: DonHang,
                where: {
                    trangThai: {
                        [Op.notIn]: [0],
                    },
                    [Op.or]: [
                        {
                            thoiGianBatDau: { [Op.lte]: thoiGianBatDau },
                            thoiGianKetThuc: { [Op.gte]: thoiGianBatDau },
                        },
                        {
                            thoiGianBatDau: { [Op.lte]: thoiGianKetThuc },
                            thoiGianKetThuc: { [Op.gte]: thoiGianKetThuc },
                        },
                        {
                            thoiGianBatDau: { [Op.gte]: thoiGianBatDau },
                            thoiGianKetThuc: { [Op.lte]: thoiGianKetThuc },
                        },
                    ],
                },
            },
        ],
    });

    return donHangCoXe.length > 0;
}

async function checkNguoiDungCoTrungLich(idNguoiDung, thoiGianBatDau, thoiGianKetThuc, trangThai) {
    const donHang = await DonHang.findOne({
        where: {
            idNguoiDung,
            trangThai,
            [Op.or]: [
                {
                    thoiGianBatDau: { [Op.lte]: thoiGianBatDau },
                    thoiGianKetThuc: { [Op.gte]: thoiGianBatDau },
                },
                {
                    thoiGianBatDau: { [Op.lte]: thoiGianKetThuc },
                    thoiGianKetThuc: { [Op.gte]: thoiGianKetThuc },
                },
                {
                    thoiGianBatDau: { [Op.gte]: thoiGianBatDau },
                    thoiGianKetThuc: { [Op.lte]: thoiGianKetThuc },
                },
            ],
        },
    });

    return donHang !== null;
}

async function createCartItem({ idNguoiDung, idXe, thoiGianBatDau, thoiGianKetThuc, soNgayThue, soGioThue }) {
    const xeDaDat = await checkXeDaDat(idXe, new Date(thoiGianBatDau), new Date(thoiGianKetThuc));
    if (xeDaDat) {
        return { ok: false, status: 400, message: 'Xe đã được đặt trong khoảng thời gian này' };
    }

    const xe = await Xe.findByPk(idXe);
    if (!xe) {
        return { ok: false, status: 404, message: 'Không tìm thấy xe với id đã chọn' };
    }

    const donGia = xe.giaTheoNgay * soNgayThue + xe.giaTheoGio * soGioThue;

    const donHang = await DonHang.create({
        idNguoiDung,
        thoiGianBatDau,
        thoiGianKetThuc,
        trangThai: 0,
        tienThueXe: donGia,
        thoiGianTao: new Date(),
        thoiGianSua: new Date(),
    });

    await ChiTietDonHang.create({
        idDonHang: donHang.id,
        idXe,
        soGioThue,
        soNgayThue,
        donGia,
        thoiGianTao: new Date(),
        thoiGianSua: new Date(),
    });

    return { ok: true, donHang };
}

async function getCartItems(idNguoiDung) {
    return DonHang.findAll({
        where: { idNguoiDung, trangThai: 0, isThanhToan: null },
        include: getDonHangWithXeInclude(['tenXe', 'hinhAnh']),
    });
}

async function removeCartItem(id, idNguoiDung) {
    const donHang = await DonHang.findOne({ where: { id, idNguoiDung } });
    if (!donHang) {
        return { ok: false, status: 404, message: 'Không tìm thấy đơn hàng' };
    }

    const chiTietDonHang = await ChiTietDonHang.findOne({ where: { idDonHang: donHang.id } });
    if (chiTietDonHang) {
        await chiTietDonHang.destroy();
    }

    await donHang.destroy();
    return { ok: true };
}

async function createPaymentOrders(idNguoiDung, listDonHang) {
    const updated = [];

    for (const id of listDonHang) {
        const donHangDetail = await DonHang.findOne({ where: { id, idNguoiDung } });
        if (!donHangDetail) {
            continue;
        }

        const thanhTien = donHangDetail.tienThueXe + donHangDetail.tienThueXe * 0.1;
        await donHangDetail.update({
            trangThai: DonHang.DA_TAO_DON_HANG,
            maDonHang: `DH${Math.floor(100000 + Math.random() * 900000)}`,
            thanhTien,
            isThanhToan: DonHang.CHUA_THANH_TOAN_IS,
            phiCoc: thanhTien * 0.2,
            thoiGianSua: new Date(),
        });
        updated.push(id);
    }

    return updated;
}

async function getOrdersForCheckout(listDonHangId) {
    return DonHang.findAll({
        where: {
            id: { [Op.in]: listDonHangId },
        },
        include: [
            {
                model: ChiTietDonHang,
                include: [
                    {
                        model: Xe,
                        attributes: [
                            'id',
                            'tenXe',
                            'bienSoXe',
                            'namSanXuat',
                            'giaTheoGio',
                            'giaTheoNgay',
                            'hinhAnh',
                        ],
                        include: getXeAdminInclude(),
                    },
                ],
            },
        ],
        order: [['thoiGianTao', 'DESC']],
    });
}

async function getAllOrdersForUser() {
    return DonHang.findAll({
        include: [
            ...getDonHangWithXeInclude(['tenXe', 'hinhAnh']),
            {
                model: NguoiDung,
                attributes: ['hoTen', 'soDienThoai'],
            },
        ],
    });
}

async function getAllOrdersForAdmin() {
    return DonHang.findAll({
        where: {
            trangThai: {
                [Op.gt]: 0,
            },
        },
        include: [
            ...getDonHangWithXeInclude([
                'id',
                'tenXe',
                'bienSoXe',
                'namSanXuat',
                'giaTheoGio',
                'giaTheoNgay',
                'hinhAnh',
            ]),
            {
                model: NguoiDung,
                attributes: ['id', 'hoTen', 'email', 'soDienThoai'],
            },
        ],
    });
}

async function confirmPayment(id) {
    const donHang = await DonHang.findByPk(id);
    if (!donHang) {
        return { ok: false, status: 404, message: 'Không tìm thấy đơn hàng' };
    }

    await donHang.update({
        trangThai: DonHang.DA_THANH_TOAN,
        thoiGianSua: new Date(),
    });

    return { ok: true };
}

async function updateStatus(id, trangThai) {
    const donHang = await DonHang.findByPk(id);
    if (!donHang) {
        return { ok: false, status: 404, message: 'Không tìm thấy đơn hàng' };
    }

    donHang.trangThai = trangThai;
    await donHang.save();
    return { ok: true };
}

async function getHistoryByUser(idNguoiDung) {
    return DonHang.findAll({
        where: {
            idNguoiDung,
            trangThai: {
                [Op.ne]: 0,
            },
        },
        include: getCustomerOrderInclude(),
        order: [['thoiGianTao', 'DESC']],
    });
}

async function cancelOrder(id, idNguoiDung) {
    const donHang = await DonHang.findOne({ where: { id, idNguoiDung } });
    if (!donHang) {
        return { ok: false, status: 404, message: 'Không tìm thấy đơn hàng' };
    }

    await donHang.update({
        trangThai: DonHang.DA_HUY_DON_HANG,
        thoiGianSua: new Date(),
    });
    return { ok: true };
}

async function getKhuyenMai(maKhuyenMai) {
    const khuyenMai = await KhuyenMai.findOne({
        where: { maKhuyenMai },
    });

    if (!khuyenMai) {
        return { ok: false, status: 404, message: 'Không tìm thấy mã khuyến mãi' };
    }

    return { ok: true, khuyenMai };
}

module.exports = {
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
};
