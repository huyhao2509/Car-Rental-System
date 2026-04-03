module.exports = (sequelize, DataTypes) => {
    const ChucVu = sequelize.define(
        'ChucVu',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            tenChucVu: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            trangThai: {
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
            tableName: 'CHUCVU',
            timestamps: false,
        }
    );

    return ChucVu;
};
