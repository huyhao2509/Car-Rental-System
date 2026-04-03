'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await queryInterface.bulkDelete('HANGXE', null, {});
        await queryInterface.sequelize.query('TRUNCATE TABLE HANGXE');
        await queryInterface.bulkInsert(
            'HANGXE',
            [
                {
                    tenHangXe: 'Toyota',
                    logoHang:
                        'https://rubicmarketing.com/wp-content/uploads/2023/02/y-nghia-logo-toyota.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Honda',
                    logoHang:
                        'https://seeklogo.com/images/H/honda-logo-517BFBE1C2-seeklogo.com.png',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Ford',
                    logoHang:
                        'https://inkythuatso.com/uploads/images/2021/11/logo-ford-inkythuatso-01-15-10-52-49.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Hyundai',
                    logoHang: 'https://rubee.com.vn/wp-content/uploads/2021/05/Logo-hyundai.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Mazda',
                    logoHang: 'https://inhoangha.com/uploads/Mazda-Logo-moi-nhat.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Kia',
                    logoHang:
                        'https://autopro8.mediacdn.vn/2019/12/13/new-kia-logo-trademark-1576211323527658932994.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'BMW',
                    logoHang:
                        'https://vudigital.co/wp-content/uploads/2021/10/logo-bmw-lich-su-hinh-thanh-va-phat-trien-tu-1916-voi-su-nham-lan-thu-vi-9.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Mercedes-Benz',
                    logoHang:
                        'https://inkythuatso.com/uploads/images/2021/11/logo-mercedes-inkythuatso-3-01-11-09-10-56.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Nissan',
                    logoHang:
                        'https://ocd.vn/wp-content/uploads/2024/03/nissan-brand-logo-1200x938-1594842850.jpeg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'Chevrolet',
                    logoHang:
                        'https://di-uploads-pod2.dealerinspire.com/biggerschevy/uploads/2018/02/2013-Chevrolet-BowTie.jpg',
                    trangThai: 1,
                    thoiGianTao: new Date(),
                    thoiGianSua: new Date(),
                },
                {
                    tenHangXe: 'VinFast',
                    logoHang:
                        'https://inkythuatso.com/uploads/images/2021/10/logo-vinfast-inkythuatso-21-11-08-55.jpg',
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
        await queryInterface.bulkDelete('HANGXE', null, {});
    },
};
