module.exports = (sequelize, DataTypes) => {
    const DonHang = sequelize.define('DonHang', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idGiamGia: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'KHUYENMAI',
                key: 'id'
            }
        },
        idNguoiDung: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'NGUOIDUNG',
                key: 'id'
            }
        },
        maDonHang: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tienThueXe: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        phiCoc: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        thanhTien: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ghiChu: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trangThai: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isThanhToan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        loaiThanhToan: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        thoiGianBatDau: {
            type: DataTypes.DATE,
            allowNull: true
        },
        thoiGianKetThuc: {
            type: DataTypes.DATE,
            allowNull: true
        },
        thoiGianTraThucTe: {
            type: DataTypes.DATE,
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
        tableName: 'DONHANG',
        timestamps: false
    });

    // Định nghĩa các trạng thái dưới dạng thuộc tính tĩnh
    DonHang.THEM_GIO_HANG = 0;
    DonHang.DA_TAO_DON_HANG = 1;
    DonHang.DA_THANH_TOAN = 2;
    DonHang.DA_HUY_DON_HANG = 3;
    DonHang.DA_HOAN_THANH = 4;

    DonHang.CHUA_THANH_TOAN_IS = 0;
    DonHang.DA_THANH_TOAN_IS = 1;

    return DonHang;
}; 