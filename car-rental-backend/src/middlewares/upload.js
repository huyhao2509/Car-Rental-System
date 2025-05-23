const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
const avatarDir = path.join(uploadDir, 'avatars');
const documentDir = path.join(uploadDir, 'documents');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

if (!fs.existsSync(documentDir)) {
    fs.mkdirSync(documentDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'anhDaiDien') {
            cb(null, avatarDir);
        } else if (file.fieldname === 'anhCanCuoc' || file.fieldname === 'anhBangLaiXe') {
            cb(null, documentDir);
        } else {
            cb(null, uploadDir);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // giới hạn 20MB
    }
});

module.exports = {
    uploadAvatar: upload.single('anhDaiDien'),
    uploadDocuments: upload.fields([
        { name: 'anhCanCuoc', maxCount: 1 },
        { name: 'anhBangLaiXe', maxCount: 1 }
    ])
}; 