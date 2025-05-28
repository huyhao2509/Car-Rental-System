const Controller = require('./Controller');
const { Xe, HangXe, LoaiXe, Sequelize } = require('../models');
const { Op } = Sequelize;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PinataService = require('../services/PinataService');

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, '../../uploads/car_images');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

class XeRouterController extends Controller {
    constructor() {
        super(Xe);
    }

    async getAll(req, res) {
        try {
            const xe = await this.model.findAll({
                include: [
                    {
                        model: HangXe,
                        attributes: ['tenHangXe']
                    },
                    {
                        model: LoaiXe,
                        attributes: ['tenLoaiXe']
                    }
                ]
            });
            res.status(200).json({
                data: xe,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);

            const { bienSoXe } = req.body;
            
            if (!bienSoXe) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe không được để trống',
                });
            }

            const xeExists = await this.model.findOne({
                where: { bienSoXe: bienSoXe }
            });

            if (xeExists) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe đã tồn tại trong hệ thống',
                });
            }

            // Upload ảnh lên Pinata nếu có
            let hinhAnhUrl = null;
            if (req.file) {
                try {
                    const fileBuffer = req.file.buffer;
                    const fileName = `car_${Date.now()}_${req.file.originalname}`;
                    const pinataResponse = await PinataService.uploadImage(
                        fileBuffer,
                        fileName,
                        'car', // userId - ở đây dùng 'car' làm prefix
                        'car_image' // documentType
                    );
                    hinhAnhUrl = pinataResponse.gatewayUrl;
                } catch (error) {
                    console.error('Lỗi upload ảnh:', error);
                    return res.status(500).json({
                        status: false,
                        message: 'Có lỗi xảy ra khi upload ảnh'
                    });
                }
            }

            const xeData = {
                ...req.body,
                hinhAnh: hinhAnhUrl,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            };

            // Chuyển đổi các trường số
            ['idHangXe', 'idLoaiXe', 'namSanXuat', 'sucChua', 'giaTheoNgay', 'giaTheoGio', 'trangThai'].forEach(field => {
                if (xeData[field]) {
                    xeData[field] = Number(xeData[field]);
                }
            });

            const xe = await this.model.create(xeData);
            
            res.status(200).json({
                status: true,
                message: 'Tạo mới thành công',
                data: xe
            });
        } catch (error) {
            console.error("Lỗi:", error);
            res.status(500).json({ 
                status: false,
                message: error.message || 'Có lỗi xảy ra khi tạo xe'
            });
        }
    }

    async update(req, res) {
        try {
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);

            const { id, bienSoXe } = req.body;

            if (!id || !bienSoXe) {
                return res.status(400).json({
                    status: false,
                    message: 'ID và biển số xe không được để trống'
                });
            }

            const xeExists = await this.model.findOne({
                where: { 
                    bienSoXe: bienSoXe,
                    id: { [Op.ne]: id }
                }
            });

            if (xeExists) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe đã tồn tại trong hệ thống'
                });
            }

            const xeToUpdate = await this.model.findByPk(id);
            if (!xeToUpdate) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy xe'
                });
            }

            // Upload ảnh mới lên Pinata nếu có
            let hinhAnhUrl = xeToUpdate.hinhAnh;
            if (req.file) {
                try {
                    const fileBuffer = req.file.buffer;
                    const fileName = `car_${Date.now()}_${req.file.originalname}`;
                    const pinataResponse = await PinataService.uploadImage(
                        fileBuffer,
                        fileName,
                        'car',
                        'car_image'
                    );
                    hinhAnhUrl = pinataResponse.gatewayUrl;
                } catch (error) {
                    console.error('Lỗi upload ảnh:', error);
                    return res.status(500).json({
                        status: false,
                        message: 'Có lỗi xảy ra khi upload ảnh'
                    });
                }
            }

            const updateData = {
                ...req.body,
                hinhAnh: hinhAnhUrl,
                thoiGianSua: new Date()
            };

            // Chuyển đổi các trường số
            ['idHangXe', 'idLoaiXe', 'namSanXuat', 'sucChua', 'giaTheoNgay', 'giaTheoGio', 'trangThai'].forEach(field => {
                if (updateData[field]) {
                    updateData[field] = Number(updateData[field]);
                }
            });

            await this.model.update(updateData, {
                where: { id: id }
            });

            const updatedXe = await this.model.findByPk(id);

            res.status(200).json({
                status: true,
                message: 'Cập nhật thành công',
                data: updatedXe
            });
        } catch (error) {
            console.error("Lỗi:", error);
            res.status(500).json({
                status: false,
                message: error.message || 'Có lỗi xảy ra khi cập nhật xe'
            });
        }
    }

    async delete(req, res) {
        try {
            await this.model.destroy({ where: { id: req.params.id } });
            res.status(200).json({
                status: true,
                message: 'Xóa thành công',
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDetail(req, res) {
        try {
            const xe = await this.model.findByPk(req.params.id, {
                include: [
                    {
                        model: HangXe,
                        attributes: ['tenHangXe']
                    },
                    {
                        model: LoaiXe,
                        attributes: ['tenLoaiXe']
                    }
                ]
            });
            res.status(200).json({
                data: xe,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new XeRouterController();
