'use strict';
const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.bulkDelete('NGUOIDUNG', null, {});
        await queryInterface.sequelize.query('TRUNCATE TABLE NGUOIDUNG');
        const salt = await bcrypt.genSalt(10);
        await queryInterface.bulkInsert('NGUOIDUNG', [
            {
                hoTen: 'Admin',
                email: 'admin@gmail.com',
                password: await bcrypt.hash('123456', salt),
                soDienThoai: '0909090909',
                idChucVu: 1,
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                hoTen: 'Nhân viên',
                email: 'nhanvien@gmail.com',
                password: await bcrypt.hash('123456', salt),
                soDienThoai: '0909090909',
                idChucVu: 3,
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            }
        ], {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('NGUOIDUNG', null, {});
    }
};
