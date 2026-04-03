const fs = require('fs');
const path = require('path');

// Lấy tên route từ command line argument
const routeName = process.argv[2];

if (!routeName) {
    console.error('Vui lòng nhập tên route!');
    console.log('Ví dụ: npm run make:route NguoiDung');
    process.exit(1);
}

// Chuẩn hóa tên
const formatName = (name) => {
    // Xử lý PascalCase (VD: NguoiDung)
    if (/^[A-Z][a-zA-Z]*$/.test(name)) {
        return name;
    }
    // Xử lý kebab-case (VD: nguoi-dung)
    if (name.includes('-')) {
        return name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
    // Xử lý snake_case (VD: nguoi_dung)
    if (name.includes('_')) {
        return name
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
    // Xử lý camelCase (VD: nguoiDung)
    return name.charAt(0).toUpperCase() + name.slice(1);
};

// Tạo tên file và class
const formattedName = formatName(routeName);
const fileName = formattedName; // Giữ nguyên tên file theo PascalCase
const controllerName = `${formattedName}Controller`;
const permissionPrefix = formattedName
    .toUpperCase()
    .replace(/([A-Z])/g, '_$1')
    .slice(1); // Chuyển PascalCase thành SNAKE_CASE

// Template cho route mới
const routeTemplate = `const express = require('express');
const router = express.Router();
const ${controllerName} = require('../controllers/${controllerName}');
const { verifyToken, checkPermission } = require('../middlewares/auth');

// Route công khai - không cần đăng nhập
router.get('/', ${controllerName}.getAll);
router.get('/phan-trang', ${controllerName}.getPagination);
router.get('/:id', ${controllerName}.getById);

// Route yêu cầu đăng nhập và phân quyền
router.use(verifyToken);
router.post('/', checkPermission('THEM_${permissionPrefix}'), ${controllerName}.create);
router.put('/:id', checkPermission('SUA_${permissionPrefix}'), ${controllerName}.update);
router.delete('/:id', checkPermission('XOA_${permissionPrefix}'), ${controllerName}.delete);

module.exports = router;`;

// Đường dẫn đến thư mục routes
const routesDir = path.join(__dirname, '..', 'routes');

// Kiểm tra và tạo thư mục routes nếu chưa tồn tại
if (!fs.existsSync(routesDir)) {
    fs.mkdirSync(routesDir, { recursive: true });
}

// Đường dẫn đến file route mới
const routePath = path.join(routesDir, `${fileName}.route.js`);

// Kiểm tra xem file đã tồn tại chưa
if (fs.existsSync(routePath)) {
    console.error(`Route ${fileName} đã tồn tại!`);
    process.exit(1);
}

// Tạo file route mới
try {
    fs.writeFileSync(routePath, routeTemplate);
    console.log(`✓ Đã tạo thành công route: ${fileName}`);
    console.log(`  Đường dẫn: ${routePath}`);
} catch (error) {
    console.error('Có lỗi khi tạo route:', error.message);
    process.exit(1);
}
