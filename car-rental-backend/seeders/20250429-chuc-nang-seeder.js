'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Tắt kiểm tra khóa ngoại
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        // Xóa tất cả dữ liệu trong bảng
        await queryInterface.bulkDelete('CHUCNANG', null, {});

        // Truncate bảng để id bắt đầu lại từ 1
        await queryInterface.sequelize.query('TRUNCATE TABLE CHUCNANG');

        // Thêm dữ liệu mới
        await queryInterface.bulkInsert('CHUCNANG', [
            // Quyền Loại Xe
            {
                id: 1,
                tenChucNang: 'Quản lý loại xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 2,
                tenChucNang: 'Thêm loại xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 3,
                tenChucNang: 'Sửa loại xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 4,
                tenChucNang: 'Xóa loại xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 5,
                tenChucNang: 'Đổi trạng thái loại xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },

            // Quyền Hãng Xe
            {
                id: 6,
                tenChucNang: 'Quản lý hãng xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 7,
                tenChucNang: 'Thêm hãng xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 8,
                tenChucNang: 'Sửa hãng xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 9,
                tenChucNang: 'Xóa hãng xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 10,
                tenChucNang: 'Đổi trạng thái hãng xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },

            // Quyền Xe
            {
                id: 11,
                tenChucNang: 'Quản lý xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 12,
                tenChucNang: 'Thêm xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 13,
                tenChucNang: 'Sửa xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 14,
                tenChucNang: 'Xóa xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 15,
                tenChucNang: 'Đổi trạng thái xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Chức Vụ
            {
                id: 16,
                tenChucNang: 'Quản lý chức vụ',
                trangThai: 1,   
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 17,
                tenChucNang: 'Thêm chức vụ',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 18,
                tenChucNang: 'Sửa chức vụ',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 19,
                tenChucNang: 'Xóa chức vụ',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 20,
                tenChucNang: 'Đổi trạng thái chức vụ',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Chức Năng
            {
                id: 21,
                tenChucNang: 'Quản lý chức năng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 22,
                tenChucNang: 'Thêm chức năng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 23,
                tenChucNang: 'Sửa chức năng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 24,
                tenChucNang: 'Xóa chức năng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 25,
                tenChucNang: 'Đổi trạng thái chức năng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Phân Quyền
            {
                id: 26,
                tenChucNang: 'Quản lý phân quyền',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 27,
                tenChucNang: 'Thêm phân quyền',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 28,
                tenChucNang: 'Sửa phân quyền',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 29,
                tenChucNang: 'Xóa phân quyền',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Khách Hàng
            {
                id: 30,
                tenChucNang: 'Quản lý khách hàng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 31,
                tenChucNang: 'Thêm khách hàng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 32,
                tenChucNang: 'Sửa khách hàng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 33,
                tenChucNang: 'Xóa khách hàng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 34,
                tenChucNang: 'Đổi trạng thái khách hàng',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Báo Cáo
            {
                id: 35,
                tenChucNang: 'Quản lý báo cáo',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 36,
                tenChucNang: 'Xuất báo cáo',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Khuyến Mãi
            {
                id: 37,
                tenChucNang: 'Quản lý khuyến mãi',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 38,
                tenChucNang: 'Thêm khuyến mãi',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date() 
            },
            {
                id: 39,
                tenChucNang: 'Sửa khuyến mãi',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date() 
            },
            {
                id: 40,
                tenChucNang: 'Xóa khuyến mãi',
                trangThai: 1,
                thoiGianTao: new Date(),    
                thoiGianSua: new Date()
            },
            {
                id: 41,
                tenChucNang: 'Đổi trạng thái khuyến mãi',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            // Quyền Đơn Thuê Xe
            {
                id: 42,
                tenChucNang: 'Quản lý đơn thuê xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 43,
                tenChucNang: 'Sửa thuê xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 44,
                tenChucNang: 'Xóa thuê xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 45,
                tenChucNang: 'Xuất báo cáo thuê xe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
        ], {});

        // Bật lại kiểm tra khóa ngoại
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('CHUCNANG', null, {});
    }
}; 