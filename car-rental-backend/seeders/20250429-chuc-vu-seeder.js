'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.bulkDelete('CHUCVU', null, {});
        await queryInterface.sequelize.query('TRUNCATE TABLE CHUCVU');

        await queryInterface.bulkInsert(
            'CHUCVU',
            [
                {
                    tenChucVu: 'Quản trị viên',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenChucVu: 'Khách hàng',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenChucVu: 'Nhân viên',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
            ],
            {}
        );

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('CHUCVU', null, {});
    },
};
