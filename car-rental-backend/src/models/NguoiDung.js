module.exports = (sequelize, DataTypes) => {
    const NguoiDung = sequelize.define(
        'NguoiDung',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            hoTen: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            soDienThoai: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            canCuocCongDan: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            anhCanCuoc: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            anhBangLaiXe: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            idChucVu: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'CHUCVU',
                    key: 'id',
                },
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
            tableName: 'NGUOIDUNG',
            timestamps: false,
        }
    );

    return NguoiDung;
};
