module.exports = (sequelize, DataTypes) => {
    const DanhGia = sequelize.define('DanhGia', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        noiDung: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        soSao: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        idChiTiet: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        idNguoiDung: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'NGUOIDUNG',
                key: 'id'
            }
        },
        isAdmin: {
            type: DataTypes.INTEGER,
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
        tableName: 'DANHGIA',
        timestamps: false
    });

    return DanhGia;
}; 