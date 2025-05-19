'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.bulkDelete('LOAIXE', null, {});
        await queryInterface.sequelize.query('TRUNCATE TABLE LOAIXE');
        await queryInterface.bulkInsert('LOAIXE', [
            {
                id: 1,
                tenLoaiXe: 'Sedan',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 2,
                tenLoaiXe: 'SUV',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 3,
                tenLoaiXe: 'Hatchback',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 4,
                tenLoaiXe: 'MPV',
                trangThai: 0,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            },
            {
                id: 5,
                tenLoaiXe: 'Coupe',
                trangThai: 1,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            }
        ], {});

        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('LOAIXE', null, {});
    }
};