module.exports = (sequelize, DataTypes) => {
    const ChucNang = sequelize.define('ChucNang', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        tenChucNang: {
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
        tableName: 'CHUCNANG',
        timestamps: false
    });

    return ChucNang;
}; 