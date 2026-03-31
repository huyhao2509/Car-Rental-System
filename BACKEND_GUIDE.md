# Backend Code Guide - Hướng Dẫn Chi Tiết

Tài liệu này giải thích cách hoạt động của từng chức năng backend từng bước.

## 1. Authentication & User (Xác thực & Người dùng)

### 1.1 Đăng ký (Register)
```
Frontend: POST /api/nguoi-dung/register
Body: {
  fullName: "Tên người dùng",
  email: "user@gmail.com",
  password: "mật khẩu",
  phone: "0123456789"
}

Response: {
  status: true,
  message: "Đăng ký thành công",
  data: {
    id: 1,
    hoTen: "Tên người dùng",
    email: "user@gmail.com",
    soDienThoai: "0123456789"
  }
}
```

**Backend flow:**
1. NguoiDung.route.js → route nhận request
2. NguoiDungController.register() → xử lý logic
3. Kiểm tra email/phone chưa tồn tại
4. Hash password bằng bcrypt
5. Lưu vào database (NguoiDung model)
6. Trả về user info (không password)

**Đặc điểm:**
- Password được mã hóa bằng bcrypt trước khi lưu
- Không bao giờ trả về password trong response
- idChucVu mặc định = 2 (user thường)

---

### 1.2 Đăng nhập (Login)
```
Frontend: POST /api/nguoi-dung/login
Body: {
  email: "user@gmail.com",
  password: "mật khẩu"
}

Response: {
  status: true,
  message: "Đăng nhập thành công",
  data: {
    token: "eyJhbGc...",  // JWT token
    user: { id, hoTen, email, ... }
  }
}
```

**Backend flow:**
1. Tìm user theo email
2. So sánh password nhập vào với password hash (bcrypt.compare)
3. Nếu sai → trả lỗi 400
4. Tạo JWT token với payload: { id, email, idChucVu }
5. Token hết hạn sau 24h

**Key file:**
- [car-rental-backend/src/utils/jwtUtils.js](../car-rental-backend/src/utils/jwtUtils.js) - JWT helper
- [car-rental-backend/src/controllers/NguoiDungController.js#L70](../car-rental-backend/src/controllers/NguoiDungController.js#L70) - login() function

---

### 1.3 OTP Login (Đăng nhập qua OTP)

**Flow:**
```
Step 1: Frontend gửi email
POST /api/nguoi-dung/send-otp
Body: { email: "user@gmail.com" }
↓
Backend:
- Kiểm tra email tồn tại
- Sinh OTP ngẫu nhiên (6 chữ số)
- Lưu vào Redis (hết hạn 5 phút)
- Gửi email chứa OTP
↓
Frontend nhận OTP code

Step 2: Frontend gửi OTP verify
POST /api/nguoi-dung/verify-otp
Body: { email: "user@gmail.com", otp: "123456" }
↓
Backend:
- Kiểm tra OTP đúng bằng cách so với Redis
- Tạo JWT token
- Trả về token + user info
```

**Key file:**
- [car-rental-backend/src/utils/otpService.js](../car-rental-backend/src/utils/otpService.js) - OTP generate/verify
- [car-rental-backend/src/utils/emailService.js](../car-rental-backend/src/utils/emailService.js) - Email send

---

### 1.4 Quên mật khẩu (Forgot Password)

**Flow:**
```
Frontend: POST /api/nguoi-dung/forgot-password
Body: { email: "user@gmail.com" }
↓
Backend:
- Kiểm tra email tồn tại
- Sinh mật khẩu ngẫu nhiên mới
- Hash password mới
- UPDATE password vào database
- Gửi email chứa password mới
- Nếu gửi email thất bại → ROLLBACK (khôi phục password cũ)
↓
Frontend: Xin user kiểm tra email
```

**Lưu ý quan trọng:**
- Nếu gửi email lỗi → password KHÔNG được thay đổi
- Tránh tình trạng user bị khóa vì email config sai
- Xem code ở [car-rental-backend/src/controllers/NguoiDungController.js#L667](../car-rental-backend/src/controllers/NguoiDungController.js#L667)

---

## 2. Booking & Cart (Đặt xe & Giỏ hàng)

### 2.1 Thêm vào giỏ hàng
```
Frontend: POST /api/client/don-hang/them-gio-hang
Header: Authorization: Bearer {token}
Body: {
  idXe: 1,
  ngayThuXe: "2024-01-15",
  ngayTraXe: "2024-01-20",
  so_luong: 1
}

Response: {
  success: true,
  message: "Thêm vào giỏ hàng thành công",
  data: { ... }
}
```

**Backend flow:**
1. Xác thực user (middleware verifyToken)
2. Kiểm tra xe tồn tại
3. Tính số ngày thuê
4. Tính tiền thuê: (ngayTraXe - ngayThuXe) * giáThueCó
5. Kiểm tra xe còn trống ngày đó
6. Tạo ChiTietDonHang và lưu vào database
7. Trả về chi tiết mục

---

### 2.2 Thanh toán (Thanh toán)
```
Frontend: POST /api/client/don-hang/thanh-toan
Header: Authorization: Bearer {token}
Body: {
  chiTietDonHang: [1, 2, 3],  // mảng ID chi tiết đơn hàng
  hinhThucThanhToan: "MOMO",  // hoặc VNPAY
  maKhuyenMai: "SUMMER2024"    // optional
}

Response: {
  success: true,
  message: "Thanh toán thành công",
  data: {
    donHangId: 123,
    trangThai: "ĐÃ THANH TOÁN"
    tongTien: 1500000
  }
}
```

**Backend flow:**
1. Lấy tất cả chi tiết đơn từ database
2. Tính tổng tiền: sum(tiênThueXe)
3. Nếu có mã khuyến mãi → kiểm tra có hợp lệ không
4. Nếu hợp lệ → giảm giá, UPDATE trangThai = CHƯA THANH TOÁN
5. Gọi Momo/VNPay API để tạo link thanh toán
6. Trả về URL thanh toán cho Frontend
7. Frontend mở URL → user trả tiền
8. Momo/VNPay gọi callback về backend
9. Backend update ORDER status = ĐÃTHANH TOÁN

**Key file:**
- [car-rental-backend/src/services/BookingCreateService.js](../car-rental-backend/src/services/BookingCreateService.js)
- Momo config: backend/src/config

---

## 3. Car Management (Quản lý xe)

### 3.1 Lấy danh sách xe (Client - public)
```
Frontend: GET /api/client/xe/get-all-client?page=1&limit=10

Response: {
  success: true,
  data: [
    {
      id: 1,
      tenXe: "Toyota Camry",
      hangXe: "Toyota",
      loaiXe: "Sedan",
      gia: 800000,
      hinhAnh: "https://...",
      soDo: 5,
      khoGioxe: 300,
      xangTieu: 8.5,
      trangThai: 1
    }
  ],
  total: 50
}
```

**Backend:**
- Query database (Xe model)
- JOIN với HangXe, LoaiXe để lấy tên
- Paginate (page, limit)
- Trả về public info (không cần auth)

---

### 3.2 Tạo xe (Admin - cần quyền)
```
Frontend: POST /api/admin/xe/create
Header: Authorization: Bearer {token}
Body (multipart): {
  tenXe: "Toyota Camry",
  idHangXe: 1,
  idLoaiXe: 2,
  gia: 800000,
  soDo: 5,
  khoGioxe: 300,
  xangTieu: 8.5,
  hinhAnh: <file>  // upload file
}

Response: {
  success: true,
  data: { idXe, tenXe, ... }
}
```

**Backend flow:**
1. Check permission (checkPermission(12))
2. Upload ảnh lên Pinata (IPFS)
3. Lưu URL ảnh từ Pinata vào database
4. Tạo record Xe trong database
5. Trả về xe info

---

## 4. Permission & Role (Phân quyền)

### Cơ chế phân quyền
```
Database:
- ChucVu (Role): Admin, User, Staff, etc
- ChucNang (Permission): create_car, delete_order, etc
- ChiTietPhanQuyen: liên kết ChucVu ↔ ChucNang

Example:
- Admin (idChucVu=1) có quyền: 1-45 (tất cả)
- User (idChucVu=2) có quyền: tạo booking, view xe
- Staff (idChucVu=3) có quyền: 30-40
```

### Middleware checkPermission
```
Backend route định nghĩa:
router.post('/create', checkPermission(12), ...)

checkPermission(12) middleware:
1. Lấy user từ token (req.user)
2. Kiểm tra user.idChucVu có quyền 12 không
3. Nếu có → next() → tiếp tục xử lý
4. Nếu không → trả lỗi 403 Forbidden
```

**Key file:**
- [car-rental-backend/src/models/ChiTietPhanQuyen.js](../car-rental-backend/src/models/ChiTietPhanQuyen.js)
- [car-rental-backend/src/middlewares/auth.js](../car-rental-backend/src/middlewares/auth.js#L50) - checkPermission()

---

## 5. Database Models (Mô hình dữ liệu)

### Mối quan hệ chính:
```
NguoiDung (Người dùng)
├─ 1:M → DonHang (1 user nhiều đơn hàng)
├─ 1:M → DanhGia (1 user nhiều đánh giá)
└─ M:1 → ChucVu (nhiều user thuộc 1 role)

DonHang (Đơn hàng)
├─ M:1 → NguoiDung
├─ 1:M → ChiTietDonHang
├─ M:1 → KhuyenMai
└─ M:1 → LichSuGiaoDich

ChiTietDonHang (Chi tiết đơn hàng)
├─ M:1 → DonHang
└─ M:1 → Xe

Xe (Xe)
├─ M:1 → HangXe (100 xe thuộc Toyota)
├─ M:1 → LoaiXe (sedan, SUV, etc)
├─ 1:M → ChiTietDonHang
└─ 1:M → DanhGia
```

---

## 6. Middleware & Utils

### Xác thực (Auth middleware)
```javascript
// [car-rental-backend/src/middlewares/auth.js]

verifyToken:
- Lấy token từ header Authorization
- JWT.verify(token) → decode token
- Lưu user vào req.user
- next()

checkPermission(quyenCanThuc):
- Lấy user từ req.user
- Query ChiTietPhanQuyen xem user có quyền này không
- Nếu có → next()
- Nếu không → 403 Forbidden
```

### Rate Limiter
```
- Giới hạn request từ 1 IP: 100 requests/15 phút
- OTP: 3 requests/1 phút
- Tránh brute force attack
```

### Error Handler
```
- Bắt tất cả lỗi từ routes
- Trả về format response thống nhất
- Log lỗi ra console hoặc file
```

---

## 📋 Flow Tổng Quát (Booking)

```
User browse website
    ↓
GET /api/client/xe/get-all-client → lấy danh sách xe
    ↓
User click "Đặt xe" → chọn ngày
    ↓
POST /api/client/don-hang/them-gio-hang → thêm vào giỏ
    ↓
User xem giỏ hàng
GET /api/client/don-hang/lay-gio-hang → lấy chi tiết giỏ
    ↓
User nhập mã khuyến mãi (optional)
POST /api/client/don-hang/get-ma-khuyen-mai → verify mã
    ↓
User bấm Thanh toán
POST /api/client/don-hang/thanh-toan → tạo link Momo/VNPay
    ↓
Frontend redirect → link thanh toán
    ↓
User trả tiền trên Momo/VNPay
    ↓
Momo/VNPay gọi callback API
    ↓
Backend UPDATE status DonHang = ĐÃTHANH TOÁN
    ↓
Admin thấy đơn hàng mới
GET /api/admin/don-hang/lay-don-hang-all-admin → xem tất cả đơn
    ↓
Admin xác nhận → giao xe cho user
POST /api/admin/don-hang/xac-nhan-thanh-toan/{id} → xác nhận
```

---

## 🔍 Bước tiếp theo

Bạn muốn hiểu chi tiết phần nào?
1. **Database Models** - Cấu trúc dữ liệu chi tiết
2. **Authentication** - Cách JWT và OTP hoạt động
3. **Booking Flow** - Chi tiết từng bước đặt xe
4. **Payment Integration** - Tích hợp Momo/VNPay
5. **File Upload** - Upload ảnh xe lên Pinata (IPFS)
