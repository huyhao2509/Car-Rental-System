module.exports = (sequelize, DataTypes) => {
    const KhuyenMai = sequelize.define(
        'KhuyenMai',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            maKhuyenMai: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            noiDung: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            soTien: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            phanTramGiam: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            trangThai: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: 'KHUYENMAI',
            timestamps: false,
        }
    );

    return KhuyenMai;
};
