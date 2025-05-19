
-- Drop tables if they already exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS LICHSUGIAODICH, CHITIETPHANQUYEN, CHUCNANG, CHUCVU, NGUOIDUNG, KHUYENMAI, DONHANG,
    CHITIETDONHANG, DANHGIA, XE, HANGXE, LOAIXE;


-- Bảng LOAIXE
CREATE TABLE LOAIXE (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenLoaiXe VARCHAR(255),
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng HANGXE
CREATE TABLE HANGXE (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenHangXe VARCHAR(255),
    logoHang VARCHAR(255),
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng XE
CREATE TABLE XE (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idLoaiXe BIGINT,
    idHangXe BIGINT,
    tenXe VARCHAR(255),
    bienSoXe VARCHAR(255),
    namSanXuat INT,
    giaTheoGio INT,
    giaTheoNgay INT,
    sucChua INT,
    trangThai INT,
    hinhAnh VARCHAR(255) NULL,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME,
    FOREIGN KEY (idLoaiXe) REFERENCES LOAIXE(id),
    FOREIGN KEY (idHangXe) REFERENCES HANGXE(id)
);

-- Bảng DANHGIA
CREATE TABLE DANHGIA (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    noiDung TEXT,
    soSao INT,
    idChiTiet BIGINT,
    idNguoiDung BIGINT,
    isAdmin INT,
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng CHITIETDONHANG
CREATE TABLE CHITIETDONHANG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idDonHang BIGINT,
    idXe BIGINT,
    soGioThue INT,
    soNgayThue INT,
    donGia INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME,
    FOREIGN KEY (idDonHang) REFERENCES DONHANG(id),
    FOREIGN KEY (idXe) REFERENCES XE(id)
);

-- Bảng DONHANG
CREATE TABLE DONHANG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idGiamGia BIGINT,
    idNguoiDung BIGINT,
    maDonHang VARCHAR(255) NULL,
    tienThueXe INT DEFAULT 0,
    phiCoc INT DEFAULT 0,
    thanhTien INT DEFAULT 0,
    ghiChu VARCHAR(255) NULL,
    thoiGianBatDau DATETIME NULL,
    thoiGianKetThuc DATETIME NULL,
    thoiGianTraThucTe DATETIME NULL,
    loaiThanhToan INT NULL,
    isThanhToan INT DEFAULT 0,
    trangThai INT NULL,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng KHUYENMAI
CREATE TABLE KHUYENMAI (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    maKhuyenMai VARCHAR(255),
    noiDung VARCHAR(255),
    soTien INT,
    phanTramGiam INT,
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng NGUOIDUNG
CREATE TABLE NGUOIDUNG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hoTen VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    soDienThoai VARCHAR(255),
    canCuocCongDan VARCHAR(255),
    anhCanCuoc VARCHAR(255),
    anhBangLaiXe VARCHAR(255),
    idChucVu BIGINT,
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME,
    FOREIGN KEY (idChucVu) REFERENCES CHUCVU(id)
);

-- Bảng CHUCVU
CREATE TABLE CHUCVU (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenChucVu VARCHAR(255),
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng CHUCNANG
CREATE TABLE CHUCNANG (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenChucNang VARCHAR(255),
    trangThai INT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

-- Bảng CHITIETPHANQUYEN
CREATE TABLE CHITIETPHANQUYEN (
    idChucVu BIGINT,
    idChucNang BIGINT,
    thoiGianTao DATETIME,
    thoiGianSua DATETIME,
    PRIMARY KEY AUTO_INCREMENT (idChucVu, idChucNang),
    FOREIGN KEY (idChucVu) REFERENCES CHUCVU(id),
    FOREIGN KEY (idChucNang) REFERENCES CHUCNANG(id)
);

-- Bảng LICHSUGIAODICH
CREATE TABLE LICHSUGIAODICH (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nganHang VARCHAR(255),
    soTaiKhoanChuyen VARCHAR(255),
    noiDungChuyenKhoan VARCHAR(255),
    thoiGianTao DATETIME,
    thoiGianSua DATETIME
);

SET FOREIGN_KEY_CHECKS = 1;
