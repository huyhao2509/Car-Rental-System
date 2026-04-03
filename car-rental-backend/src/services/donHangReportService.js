const { Op } = require('sequelize');
const {
    DonHang,
    ChiTietDonHang,
    Xe,
    NguoiDung,
    DanhGia,
    Sequelize,
} = require('../models');
const {
    getMonthName,
    getMonthRange,
    getRevenueByRange,
    countRecords,
    sumOrderRevenue,
    getReportCarTypeInclude,
} = require('./donHangQueryHelpers');

async function buildDashboardStats() {
    const totalRevenue = await sumOrderRevenue({
        trangThai: {
            [Op.in]: [2, 4],
        },
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    const monthlyRevenue = await sumOrderRevenue({
        trangThai: 2,
        thoiGianBatDau: {
            [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
    });

    const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    const lastMonthRevenue = await sumOrderRevenue({
        trangThai: 2,
        thoiGianTao: {
            [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
        },
    });

    const monthlyRevenueData = [];
    for (let i = 5; i >= 0; i--) {
        const month = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        const { firstDay, lastDay } = getMonthRange(year, month);
        const monthRevenue = await getRevenueByRange({
            start: firstDay,
            end: lastDay,
            dateField: 'thoiGianTao',
            statuses: [2],
        });

        monthlyRevenueData.push({
            month: getMonthName(month),
            value: monthRevenue,
        });
    }

    const confirmedOrders = await countRecords(DonHang, { trangThai: 2 });
    const completedOrders = await countRecords(DonHang, { trangThai: 4 });
    const cancelledOrders = await countRecords(DonHang, { trangThai: 3 });

    const topRentedCarsResult = await ChiTietDonHang.findAll({
        attributes: ['idXe', [Sequelize.fn('COUNT', Sequelize.col('idXe')), 'rentCount']],
        include: [
            {
                model: Xe,
                attributes: ['tenXe'],
            },
        ],
        group: ['idXe', 'Xe.id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('idXe')), 'DESC']],
        limit: 5,
    });

    let topRentedCars = [];
    if (topRentedCarsResult && topRentedCarsResult.length > 0) {
        const maxRentCount = Math.max(
            ...topRentedCarsResult.map((car) => parseInt(car.dataValues.rentCount))
        );

        topRentedCars = topRentedCarsResult.map((car) => {
            const rentCount = parseInt(car.dataValues.rentCount);
            return {
                id: car.idXe,
                name: car.Xe ? car.Xe.tenXe : 'Không xác định',
                rentCount,
                percentage: Math.round((rentCount / maxRentCount) * 100),
            };
        });
    }

    const recentOrders = await DonHang.findAll({
        limit: 10,
        order: [['thoiGianTao', 'DESC']],
        include: [
            { model: NguoiDung, attributes: ['hoTen', 'email', 'soDienThoai'] },
            {
                model: ChiTietDonHang,
                include: [{ model: Xe, attributes: ['tenXe', 'bienSoXe'] }],
            },
        ],
    });

    return {
        totalCars: await Xe.count(),
        availableCars: await Xe.count({ where: { trangThai: 1 } }),
        totalCustomers: await countRecords(NguoiDung, { idChucVu: 2 }),
        pendingOrders: await countRecords(DonHang, { trangThai: 1 }),
        confirmedOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        monthlyRevenue,
        lastMonthRevenue,
        topRentedCars,
        monthlyRevenueData,
        recentOrders,
    };
}

async function buildReportsData({ year, month }) {
    const currentYear = parseInt(year, 10);
    const currentMonth = parseInt(month, 10);

    const monthlyRevenueData = [];
    for (let i = 1; i <= 12; i++) {
        const { firstDay, lastDay } = getMonthRange(currentYear, i - 1);
        const monthlyRevenue = await getRevenueByRange({
            start: firstDay,
            end: lastDay,
            dateField: 'thoiGianTao',
            statuses: [2, 4],
        });

        monthlyRevenueData.push({
            name: getMonthName(i - 1),
            value: monthlyRevenue,
        });
    }

    const growthData = [];
    const previousYear = currentYear - 1;
    for (let i = 1; i <= 12; i++) {
        const { firstDay: currentMonthFirstDay, lastDay: currentMonthLastDay } =
            getMonthRange(currentYear, i - 1);
        const { firstDay: previousMonthFirstDay, lastDay: previousMonthLastDay } =
            getMonthRange(previousYear, i - 1);

        const currentMonthRevenue = await getRevenueByRange({
            start: currentMonthFirstDay,
            end: currentMonthLastDay,
            dateField: 'thoiGianTao',
            statuses: [2, 4],
        });

        const previousMonthRevenue = await getRevenueByRange({
            start: previousMonthFirstDay,
            end: previousMonthLastDay,
            dateField: 'thoiGianTao',
            statuses: [2, 4],
        });

        let growthPercentage = 0;
        if (previousMonthRevenue > 0) {
            growthPercentage =
                ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
        }

        growthData.push({
            name: getMonthName(i - 1),
            value: parseFloat(growthPercentage.toFixed(1)),
        });
    }

    const carTypeData = await ChiTietDonHang.findAll({
        attributes: [
            [Sequelize.col('Xe.LoaiXe.tenLoaiXe'), 'name'],
            [Sequelize.fn('COUNT', Sequelize.col('ChiTietDonHang.id')), 'count'],
        ],
        include: getReportCarTypeInclude(),
        group: ['Xe.LoaiXe.tenLoaiXe'],
        raw: true,
    });

    const totalTypeCount = carTypeData.reduce((sum, type) => sum + parseInt(type.count), 0);
    const formattedCarTypeData = carTypeData.map((type) => ({
        name: type.name || 'Không xác định',
        value:
            totalTypeCount > 0 ? Math.round((parseInt(type.count) / totalTypeCount) * 100) : 0,
    }));

    const rentalDurations = await ChiTietDonHang.findAll({
        attributes: [
            [
                Sequelize.literal(`
                        CASE 
                            WHEN soNgayThue = 1 THEN '1 ngày'
                            WHEN soNgayThue BETWEEN 2 AND 3 THEN '2-3 ngày'
                            WHEN soNgayThue BETWEEN 4 AND 7 THEN '4-7 ngày'
                            WHEN soNgayThue BETWEEN 8 AND 14 THEN '1-2 tuần'
                            ELSE 'Trên 2 tuần'
                        END
                    `),
                'duration_category',
            ],
            [Sequelize.fn('COUNT', Sequelize.col('ChiTietDonHang.id')), 'count'],
        ],
        group: ['duration_category'],
        raw: true,
    });

    const totalDurationCount = rentalDurations.reduce(
        (sum, duration) => sum + parseInt(duration.count),
        0
    );
    const rentalDurationData = rentalDurations.map((duration) => ({
        name: duration.duration_category,
        value:
            totalDurationCount > 0
                ? Math.round((parseInt(duration.count) / totalDurationCount) * 100)
                : 0,
    }));

    const totalRentals = await countRecords(DonHang);
    const totalRevenue = await sumOrderRevenue({
        trangThai: {
            [Op.in]: [2, 4],
        },
    });

    const averageRevenueResult = await DonHang.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('thanhTien')), 'averageRental']],
        where: {
            trangThai: {
                [Op.in]: [2, 4],
            },
        },
        raw: true,
    });
    const averageRentalPrice = averageRevenueResult?.averageRental || 0;

    const completedOrders = await countRecords(DonHang, { trangThai: 4 });
    const completionRate = totalRentals > 0 ? Math.round((completedOrders / totalRentals) * 100) : 0;

    const cancelledOrders = await countRecords(DonHang, { trangThai: 3 });
    const cancellationRate =
        totalRentals > 0 ? Math.round((cancelledOrders / totalRentals) * 100) : 0;

    const mostRentedCarResult = await ChiTietDonHang.findAll({
        attributes: ['idXe', [Sequelize.fn('COUNT', Sequelize.col('idXe')), 'rentCount']],
        include: [
            {
                model: Xe,
                attributes: ['tenXe'],
            },
        ],
        group: ['idXe', 'Xe.id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('idXe')), 'DESC']],
        limit: 1,
    });

    const mostRentedCar =
        mostRentedCarResult.length > 0 ? mostRentedCarResult[0].Xe.tenXe : 'Không có dữ liệu';

    const mostActiveCustomerResult = await DonHang.findAll({
        attributes: [
            'idNguoiDung',
            [Sequelize.fn('COUNT', Sequelize.col('idNguoiDung')), 'orderCount'],
        ],
        include: [
            {
                model: NguoiDung,
                attributes: ['hoTen'],
            },
        ],
        group: ['idNguoiDung', 'NguoiDung.id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('idNguoiDung')), 'DESC']],
        limit: 1,
    });

    const mostActiveCustomer =
        mostActiveCustomerResult.length > 0
            ? mostActiveCustomerResult[0].NguoiDung.hoTen
            : 'Không có dữ liệu';

    const topCarsDataResult = await ChiTietDonHang.findAll({
        attributes: [
            'idXe',
            [Sequelize.fn('COUNT', Sequelize.col('idXe')), 'rentCount'],
            [Sequelize.fn('SUM', Sequelize.col('donGia')), 'revenue'],
        ],
        include: [
            {
                model: Xe,
                attributes: ['tenXe', 'id'],
            },
        ],
        group: ['idXe', 'Xe.id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('idXe')), 'DESC']],
        limit: 5,
    });

    const topCarsData = await Promise.all(
        topCarsDataResult.map(async (car) => {
            const avgRatingResult = await ChiTietDonHang.findOne({
                attributes: [[Sequelize.fn('AVG', Sequelize.col('danhGia.soSao')), 'avgRating']],
                where: { idXe: car.idXe },
                include: [
                    {
                        model: DanhGia,
                        as: 'danhGia',
                        attributes: [],
                    },
                ],
                raw: true,
            });

            const avgRating = avgRatingResult?.avgRating || 0;

            const { firstDay: currentMonthFirstDay, lastDay: currentMonthLastDay } =
                getMonthRange(currentYear, currentMonth - 1);
            const { firstDay: prevMonthFirstDay, lastDay: prevMonthLastDay } = getMonthRange(
                currentYear,
                currentMonth - 2
            );

            const currentMonthCount = await ChiTietDonHang.count({
                where: {
                    idXe: car.idXe,
                    thoiGianTao: {
                        [Op.between]: [currentMonthFirstDay, currentMonthLastDay],
                    },
                },
            });

            const prevMonthCount = await ChiTietDonHang.count({
                where: {
                    idXe: car.idXe,
                    thoiGianTao: {
                        [Op.between]: [prevMonthFirstDay, prevMonthLastDay],
                    },
                },
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
                growth,
            };
        })
    );

    return {
        monthlyRevenueData,
        growthData,
        carTypeData: formattedCarTypeData,
        rentalDurationData,
        summaryStats: {
            totalRentals,
            totalRevenue,
            averageRentalPrice,
            mostRentedCar,
            mostActiveCustomer,
            completionRate,
            cancellationRate,
        },
        topCarsData,
    };
}

module.exports = {
    buildDashboardStats,
    buildReportsData,
};
