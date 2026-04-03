// src/services/DocumentUploadService.js
const path = require('path');
const { promises: fsPromises } = require('fs');
const { v4: uuidv4 } = require('uuid');
const NguoiDung = require('../models/NguoiDung');
const pinataService = require('./PinataService');

class DocumentUploadService {
    // Validate file upload
    static validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!file) {
            throw new Error('Không có file được tải lên');
        }

        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, JPG)');
        }

        if (file.size > maxSize) {
            throw new Error('Kích thước file không được vượt quá 5MB');
        }
    };

    // Xóa hash IPFS cũ từ Pinata (nếu có)
    static deleteOldIPFSHash = async (user, documentType) => {
        try {
            let oldIpfsHash;

            if (documentType === 'identityCard' && user.maIpfsHashCanCuoc) {
                oldIpfsHash = user.maIpfsHashCanCuoc;
            } else if (documentType === 'drivingLicense' && user.maIpfsHashBangLaiXe) {
                oldIpfsHash = user.maIpfsHashBangLaiXe;
            }

            if (oldIpfsHash) {
                await pinataService.deleteFile(oldIpfsHash);
            }
        } catch (error) {
            console.error('Lỗi khi xóa hash IPFS cũ:', error);
            // Không throw lỗi vì việc xóa cũ không nên chặn quá trình upload mới
        }
    };

    // Upload tài liệu
    static uploadDocument = async (userId, file, documentType) => {
        // Validate file
        this.validateFile(file);

        try {
            // Kiểm tra người dùng
            const user = await NguoiDung.findOne({
                where: {
                    maNguoiDung: userId,
                    maTrangThaiTaiKhoan: 1, // Tài khoản đang hoạt động
                },
            });

            if (!user) {
                throw new Error('Người dùng không tồn tại hoặc đã bị vô hiệu hóa');
            }

            // Xóa file cũ trên Pinata (nếu có)
            await this.deleteOldIPFSHash(user, documentType);

            // Tạo tên file duy nhất
            const fileExtension = path.extname(file.originalname);
            const newFileName = `${documentType}_${userId}_${uuidv4()}${fileExtension}`;

            // Chuẩn bị file buffer
            let fileBuffer;
            if (file.buffer) {
                // Nếu multer đã lưu file vào memory
                fileBuffer = file.buffer;
            } else {
                // Nếu multer đã lưu file vào disk
                fileBuffer = await fsPromises.readFile(file.path);
            }

            // Upload lên Pinata
            const { ipfsHash, gatewayUrl } = await pinataService.uploadImage(
                fileBuffer,
                newFileName,
                userId,
                documentType
            );

            // Cập nhật database với hash IPFS và URL gateway
            const updateData = {};

            if (documentType === 'drivingLicense') {
                updateData.maAnhBangLaiXe = gatewayUrl;
                updateData.maIpfsHashBangLaiXe = ipfsHash;
            } else {
                updateData.maAnhCanCuoc = gatewayUrl;
                updateData.maIpfsHashCanCuoc = ipfsHash;
            }

            // Cập nhật user trong database
            await NguoiDung.update(updateData, { where: { maNguoiDung: userId } });

            // Xóa file local nếu tồn tại (multer đã lưu file trên disk)
            if (file.path) {
                try {
                    await fsPromises.unlink(file.path);
                } catch {
                    // Không xử lý lỗi này vì file có thể không tồn tại
                }
            }

            return {
                message: `Tải lên ${documentType === 'identityCard' ? 'CMND/CCCD' : 'bằng lái xe'} thành công`,
                documentUrl: gatewayUrl,
                ipfsHash: ipfsHash,
            };
        } catch (error) {
            console.error('Lỗi khi tải lên tài liệu:', error);
            throw error;
        }
    };

    // Lấy tài liệu của người dùng
    static getUserDocuments = async (userId) => {
        try {
            const user = await NguoiDung.findOne({
                where: { maNguoiDung: userId },
                attributes: [
                    'maAnhBangLaiXe',
                    'maAnhCanCuoc',
                    'maIpfsHashBangLaiXe',
                    'maIpfsHashCanCuoc',
                ],
            });

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            return {
                drivingLicense: user.maAnhBangLaiXe,
                identityCard: user.maAnhCanCuoc,
                drivingLicenseHash: user.maIpfsHashBangLaiXe,
                identityCardHash: user.maIpfsHashCanCuoc,
            };
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài liệu:', error);
            throw error;
        }
    };

    // Xóa tài liệu
    static deleteDocument = async (userId, documentType) => {
        try {
            const user = await NguoiDung.findOne({
                where: { maNguoiDung: userId },
            });

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            // Xóa từ Pinata
            if (documentType === 'drivingLicense' && user.maIpfsHashBangLaiXe) {
                await pinataService.deleteFile(user.maIpfsHashBangLaiXe);
            } else if (documentType === 'identityCard' && user.maIpfsHashCanCuoc) {
                await pinataService.deleteFile(user.maIpfsHashCanCuoc);
            }

            // Cập nhật database
            const updateData = {};

            if (documentType === 'drivingLicense') {
                updateData.maAnhBangLaiXe = null;
                updateData.maIpfsHashBangLaiXe = null;
            } else {
                updateData.maAnhCanCuoc = null;
                updateData.maIpfsHashCanCuoc = null;
            }

            await NguoiDung.update(updateData, { where: { maNguoiDung: userId } });

            return {
                message: `Xóa ${documentType === 'identityCard' ? 'CMND/CCCD' : 'bằng lái xe'} thành công`,
            };
        } catch (error) {
            console.error('Lỗi khi xóa tài liệu:', error);
            throw error;
        }
    };
}

module.exports = DocumentUploadService;
