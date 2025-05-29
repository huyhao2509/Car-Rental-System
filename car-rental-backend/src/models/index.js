const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: false,
        timezone: '+07:00'
    }
);

// Kiểm tra kết nối
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công.');
    } catch (error) {
        console.error('Không thể kết nối đến database:', error);
        process.exit(1);
    }
};

connectDB();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các model
db.LoaiXe = require('./LoaiXe')(sequelize, Sequelize);
db.HangXe = require('./HangXe')(sequelize, Sequelize);
db.Xe = require('./Xe')(sequelize, Sequelize);
db.DanhGia = require('./DanhGia')(sequelize, Sequelize);
db.ChiTietDonHang = require('./ChiTietDonHang')(sequelize, Sequelize);
db.DonHang = require('./DonHang')(sequelize, Sequelize);
db.KhuyenMai = require('./KhuyenMai')(sequelize, Sequelize);
db.NguoiDung = require('./NguoiDung')(sequelize, Sequelize);
db.ChucVu = require('./ChucVu')(sequelize, Sequelize);
db.ChucNang = require('./ChucNang')(sequelize, Sequelize);
db.ChiTietPhanQuyen = require('./ChiTietPhanQuyen')(sequelize, Sequelize);
db.LichSuGiaoDich = require('./LichSuGiaoDich')(sequelize, Sequelize);

// Thiết lập các mối quan hệ
db.LoaiXe.hasMany(db.Xe, { foreignKey: 'idLoaiXe' });
db.Xe.belongsTo(db.LoaiXe, { foreignKey: 'idLoaiXe' });

db.HangXe.hasMany(db.Xe, { foreignKey: 'idHangXe' });
db.Xe.belongsTo(db.HangXe, { foreignKey: 'idHangXe' });

db.DonHang.hasMany(db.ChiTietDonHang, { foreignKey: 'idDonHang' });
db.ChiTietDonHang.belongsTo(db.DonHang, { foreignKey: 'idDonHang' });

db.Xe.hasMany(db.ChiTietDonHang, { foreignKey: 'idXe' });
db.ChiTietDonHang.belongsTo(db.Xe, { foreignKey: 'idXe' });

db.KhuyenMai.hasMany(db.DonHang, { foreignKey: 'idGiamGia' });
db.DonHang.belongsTo(db.KhuyenMai, { foreignKey: 'idGiamGia' });

db.NguoiDung.hasMany(db.DonHang, { foreignKey: 'idNguoiDung' });
db.DonHang.belongsTo(db.NguoiDung, { foreignKey: 'idNguoiDung' });

db.ChucVu.hasMany(db.NguoiDung, { foreignKey: 'idChucVu' });
db.NguoiDung.belongsTo(db.ChucVu, { foreignKey: 'idChucVu' });

db.ChucVu.belongsToMany(db.ChucNang, { through: db.ChiTietPhanQuyen, foreignKey: 'idChucVu' });
db.ChucNang.belongsToMany(db.ChucVu, { through: db.ChiTietPhanQuyen, foreignKey: 'idChucNang' });

// Thêm mối quan hệ DanhGia - ChiTietDonHang
db.ChiTietDonHang.hasOne(db.DanhGia, { foreignKey: 'idChiTiet' });
db.DanhGia.belongsTo(db.ChiTietDonHang, { foreignKey: 'idChiTiet' });

// Đồng bộ hóa các model với database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Đồng bộ database thành công');
    })
    .catch((error) => {
        console.error('Lỗi đồng bộ database:', error);
    });

module.exports = db; 