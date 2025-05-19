const fs = require('fs');
const path = require('path');

// Lấy tên model từ tham số dòng lệnh
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Vui lòng cung cấp tên model. Ví dụ: npm run make:seeder ChucVu');
    process.exit(1);
}

const modelName = args[0];
const tableName = modelName.toUpperCase();

// Tạo tên file seeder với timestamp
const date = new Date();
const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
const fileName = `${timestamp}-${modelName.toLowerCase()}-seeder.js`;

// Xác định đường dẫn đến thư mục seeders
const seedersDir = path.join(process.cwd(), 'seeders');

// Tạo thư mục seeders nếu chưa tồn tại
if (!fs.existsSync(seedersDir)) {
    fs.mkdirSync(seedersDir, { recursive: true });
}

// Tạo nội dung mẫu cho file seeder
const seederContent = `'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('${tableName}', null, {});
    await queryInterface.sequelize.query('TRUNCATE TABLE ${tableName}');
    await queryInterface.bulkInsert('${tableName}', [
      {
        // Thêm dữ liệu mẫu ở đây
        thoiGianTao: new Date(),
        thoiGianSua: new Date()
      }
    ], {});
    
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('${tableName}', null, {});
  }
};`;

// Ghi file seeder
const filePath = path.join(seedersDir, fileName);
fs.writeFileSync(filePath, seederContent);

console.log(`Seeder đã được tạo: ${filePath}`); 