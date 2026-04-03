module.exports = (sequelize, DataTypes) => {
    const ChiTietDonHang = sequelize.define(
        'ChiTietDonHang',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            idDonHang: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'DONHANG',
                    key: 'id',
                },
            },
            idXe: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'XE',
                    key: 'id',
                },
            },
            soGioThue: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            soNgayThue: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            donGia: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            thoiGianTao: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            thoiGianSua: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'CHITIETDONHANG',
            timestamps: false,
        }
    );

    return ChiTietDonHang;
};
