module.exports = (sequelize, DataTypes) => {
    const LichSuGiaoDich = sequelize.define('LichSuGiaoDich', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nganHang: {
            type: DataTypes.STRING,
            allowNull: true
        },
        soTaiKhoanChuyen: {
            type: DataTypes.STRING,
            allowNull: true
        },
        noiDungChuyenKhoan: {
            type: DataTypes.STRING,
            allowNull: true
        },
        thoiGianTao: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'LICHSUGIAODICH',
        timestamps: false
    });

    return LichSuGiaoDich;
}; 