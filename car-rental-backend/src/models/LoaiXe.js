module.exports = (sequelize, DataTypes) => {
    const LoaiXe = sequelize.define('LoaiXe', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        tenLoaiXe: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trangThai: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        thoiGianTao: {
            type: DataTypes.DATE,
            allowNull: true
        },
        thoiGianSua: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'LOAIXE',
        timestamps: false
    });

    return LoaiXe;
}; 