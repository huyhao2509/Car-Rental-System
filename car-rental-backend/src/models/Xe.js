module.exports = (sequelize, DataTypes) => {
    const Xe = sequelize.define('Xe', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        idLoaiXe: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'LOAIXE',
                key: 'id'
            }
        },
        idHangXe: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'HANGXE',
                key: 'id'
            }
        },
        tenXe: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bienSoXe: {
            type: DataTypes.STRING,
            allowNull: true
        },
        namSanXuat: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        giaTheoGio: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        giaTheoNgay: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sucChua: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        trangThai: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        hinhAnh: {
            type: DataTypes.STRING,
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
        tableName: 'XE',
        timestamps: false
    });

    return Xe;
}; 