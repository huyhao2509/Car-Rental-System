const sequelize = require('./src/config/connectDB').sequelize; // Import sequelize instance
const Quyen = require('./src/models/Quyen');
const TrangThaiTaiKhoan = require('./src/models/TrangThaiTaiKhoan');
const NguoiDung = require('./src/models/NguoiDung');
const KhuyenMai = require('./src/models/KhuyenMai');
const LoaiXe = require('./src/models/LoaiXe');
const HangXe = require('./src/models/HangXe');  
const TrangThaiXe = require('./src/models/TrangThaiXe');
const Xe = require('./src/models/Xe');
const DonHang = require('./src/models/DonHang');
const ThanhToan = require('./src/models/ThanhToan');
const DanhGia = require('./src/models/DanhGia');
const DonHangXe = require('./src/models/DonHangXe');
// Đồng bộ hóa mô hình với cơ sở dữ liệu
sequelize.sync({ alter: true }) //force: true(xóa bảng cũ và tạo mảng mới), force: false(không xóa bảng cũ), alter: true (cập nhật bảng cũ)
  .then(() => {
    console.log('Cơ sở dữ liệu đã được đồng bộ!');
  })

  .catch(err => {
    console.error('Lỗi khi đồng bộ hóa:', err);
  });
//Huy12321232123asdfsaf@
