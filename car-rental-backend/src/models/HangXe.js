module.exports = (sequelize, DataTypes) => {
    const HangXe = sequelize.define('HangXe', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        tenHangXe: {
            type: DataTypes.STRING,
            allowNull: true
        },
        logoHang: {
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
        tableName: 'HANGXE',
        timestamps: false
    });

    return HangXe;
}; 