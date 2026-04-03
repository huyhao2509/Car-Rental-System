const { Sequelize } = require('sequelize');
require('dotenv').config();

function createSequelizeInstance() {
    return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: false,
        timezone: '+07:00',
    });
}

const sequelize = createSequelizeInstance();

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

function loadModels() {
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
}

function setupAssociations() {
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
    db.ChucNang.belongsToMany(db.ChucVu, {
        through: db.ChiTietPhanQuyen,
        foreignKey: 'idChucNang',
    });

    db.ChiTietDonHang.hasOne(db.DanhGia, { foreignKey: 'idChiTiet', as: 'danhGia' });
    db.DanhGia.belongsTo(db.ChiTietDonHang, { foreignKey: 'idChiTiet', as: 'chiTietDonHang' });
}

function runAutoSync() {
    // Chỉ đồng bộ schema khi bật explicit để tránh lỗi xung đột FK/PK trên DB đã có dữ liệu.
    const shouldSync = String(process.env.DB_AUTO_SYNC).toLowerCase() === 'true';
    if (!shouldSync) {
        console.log('Bỏ qua sequelize.sync (DB_AUTO_SYNC != true).');
        return;
    }

    const useAlter = String(process.env.DB_SYNC_ALTER).toLowerCase() === 'true';
    sequelize
        .sync({ alter: useAlter })
        .then(() => {
            console.log(`Đồng bộ database thành công (alter=${useAlter})`);
        })
        .catch((error) => {
            console.error('Lỗi đồng bộ database:', error);
        });
}

loadModels();
setupAssociations();
runAutoSync();

module.exports = db;
