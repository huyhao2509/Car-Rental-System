const { Op } = require('sequelize');
const {
    DonHang,
    ChiTietDonHang,
    Xe,
    HangXe,
    LoaiXe,
    NguoiDung,
} = require('../models');

function getMonthNames() {
    return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
}

function getMonthName(monthIndex) {
    return getMonthNames()[monthIndex];
}

function getMonthRange(year, monthIndex) {
    return {
        firstDay: new Date(year, monthIndex, 1),
        lastDay: new Date(year, monthIndex + 1, 0, 23, 59, 59),
    };
}

async function getRevenueByRange({ start, end, dateField = 'thoiGianTao', statuses = [2, 4] }) {
    const revenue = await DonHang.sum('thanhTien', {
        where: {
            trangThai: {
                [Op.in]: statuses,
            },
            [dateField]: {
                [Op.between]: [start, end],
            },
        },
    });

    return revenue || 0;
}

async function countRecords(model, where) {
    return model.count({ where });
}

async function sumOrderRevenue(where) {
    const total = await DonHang.sum('thanhTien', { where });
    return total || 0;
}

async function findFirstOrder(attributes, include, group, order, fallback = null) {
    const result = await DonHang.findOne({
        attributes,
        include,
        group,
        order,
        raw: true,
    });

    return result || fallback;
}

function getXeInclude() {
    return [
        {
            model: HangXe,
            attributes: ['tenHangXe'],
        },
        {
            model: LoaiXe,
            attributes: ['tenLoaiXe'],
        },
    ];
}

function getXeAdminInclude() {
    return [
        {
            model: HangXe,
            attributes: ['id', 'tenHangXe'],
        },
        {
            model: LoaiXe,
            attributes: ['id', 'tenLoaiXe'],
        },
    ];
}

function getDonHangWithXeInclude(attributes = ['tenXe', 'hinhAnh']) {
    return [
        {
            model: ChiTietDonHang,
            include: [
                {
                    model: Xe,
                    attributes,
                    include: getXeInclude(),
                },
            ],
        },
    ];
}

function getDonHangWithXeAndNguoiDungInclude(isAdmin = false) {
    const nguoiDungAttributes = isAdmin
        ? ['id', 'hoTen', 'email', 'soDienThoai']
        : ['hoTen', 'soDienThoai'];

    return [
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
            attributes: nguoiDungAttributes,
        },
    ];
}

function getCustomerOrderInclude() {
    return [
        {
            model: ChiTietDonHang,
            include: [
                {
                    model: Xe,
                    attributes: ['tenXe', 'hinhAnh'],
                    include: getXeInclude(),
                },
            ],
        },
    ];
}

function getDashboardRecentOrderInclude() {
    return [
        { model: NguoiDung, attributes: ['hoTen', 'email', 'soDienThoai'] },
        {
            model: ChiTietDonHang,
            include: [{ model: Xe, attributes: ['tenXe', 'bienSoXe'] }],
        },
    ];
}

function getReportCarTypeInclude() {
    return [
        {
            model: Xe,
            attributes: [],
            include: [
                {
                    model: LoaiXe,
                    attributes: [],
                },
            ],
        },
    ];
}

module.exports = {
    getMonthNames,
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
};
