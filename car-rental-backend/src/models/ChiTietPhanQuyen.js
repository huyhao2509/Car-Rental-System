module.exports = (sequelize, DataTypes) => {
    const ChiTietPhanQuyen = sequelize.define('ChiTietPhanQuyen', {
        idChucVu: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: 'CHUCVU',
                key: 'id'
            }
        },
        idChucNang: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            references: {
                model: 'CHUCNANG',
                key: 'id'
            }
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
        tableName: 'CHITIETPHANQUYEN',
        timestamps: false
    });

    return ChiTietPhanQuyen;
}; 