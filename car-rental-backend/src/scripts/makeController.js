const fs = require('fs');
const path = require('path');

// Lấy tên controller từ command line argument
const controllerName = process.argv[2];

if (!controllerName) {
    console.error('Vui lòng nhập tên controller!');
    console.log('Ví dụ: npm run make:controller TenController');
    process.exit(1);
}

const formattedName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
const controllerFileName = formattedName.includes('Controller') ? formattedName : `${formattedName}Controller`;

const controllerTemplate = `const Controller = require('./Controller');
const { ${formattedName.replace('Controller', '')} } = require('../models');

class ${controllerFileName} extends Controller {
    constructor() {
        super(${formattedName.replace('Controller', '')});
    }

    // Thêm các phương thức riêng cho controller này nếu cần
}

module.exports = new ${controllerFileName}();
`;

const controllersDir = path.join(__dirname, '..', 'controllers');

if (!fs.existsSync(controllersDir)) {
    fs.mkdirSync(controllersDir, { recursive: true });
}

const controllerPath = path.join(controllersDir, `${controllerFileName}.js`);

if (fs.existsSync(controllerPath)) {
    console.error(`Controller ${controllerFileName} đã tồn tại!`);
    process.exit(1);
}

try {
    fs.writeFileSync(controllerPath, controllerTemplate);
    console.log(`✓ Đã tạo thành công controller: ${controllerFileName}`);
    console.log(`  Đường dẫn: ${controllerPath}`);
} catch (error) {
    console.error('Có lỗi khi tạo controller:', error.message);
    process.exit(1);
} 