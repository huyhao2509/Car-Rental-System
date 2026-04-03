const Controller = require('./Controller');
const { Xe, HangXe, LoaiXe, Sequelize } = require('../models');
const { Op } = Sequelize;
const PinataService = require('../services/PinataService');

class XeRouterController extends Controller {
    constructor() {
        super(Xe);
    }

    handleInternalError(res, error, defaultMessage = null) {
        console.error('Lỗi xử lý xe:', error);
        if (defaultMessage) {
            return res.status(500).json({
                status: false,
                message: defaultMessage,
            });
        }
        return res.status(500).json({ error: error.message });
    }

    async getAll(req, res) {
        try {
            const xe = await this.model.findAll({
                include: [
                    {
                        model: HangXe,
                        attributes: ['tenHangXe'],
                    },
                    {
                        model: LoaiXe,
                        attributes: ['tenLoaiXe'],
                    },
                ],
            });
            res.status(200).json({
                data: xe,
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }

    async create(req, res) {
        try {
            const { bienSoXe } = req.body;

            if (!bienSoXe) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe không được để trống',
                });
            }

            const xeExists = await this.model.findOne({
                where: { bienSoXe: bienSoXe },
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
                    return this.handleInternalError(res, error, 'Có lỗi xảy ra khi upload ảnh');
                }
            }

            const xeData = {
                ...req.body,
                hinhAnh: hinhAnhUrl,
                thoiGianTao: new Date(),
                thoiGianSua: new Date(),
            };

            // Chuyển đổi các trường số
            [
                'idHangXe',
                'idLoaiXe',
                'namSanXuat',
                'sucChua',
                'giaTheoNgay',
                'giaTheoGio',
                'trangThai',
            ].forEach((field) => {
                if (xeData[field]) {
                    xeData[field] = Number(xeData[field]);
                }
            });

            const xe = await this.model.create(xeData);

            res.status(200).json({
                status: true,
                message: 'Tạo mới thành công',
                data: xe,
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                error.message || 'Có lỗi xảy ra khi tạo xe'
            );
        }
    }

    async update(req, res) {
        try {
            const { id, bienSoXe } = req.body;

            if (!id || !bienSoXe) {
                return res.status(400).json({
                    status: false,
                    message: 'ID và biển số xe không được để trống',
                });
            }

            const xeExists = await this.model.findOne({
                where: {
                    bienSoXe: bienSoXe,
                    id: { [Op.ne]: id },
                },
            });

            if (xeExists) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe đã tồn tại trong hệ thống',
                });
            }

            const xeToUpdate = await this.model.findByPk(id);
            if (!xeToUpdate) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy xe',
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
                    return this.handleInternalError(res, error, 'Có lỗi xảy ra khi upload ảnh');
                }
            }

            const updateData = {
                ...req.body,
                hinhAnh: hinhAnhUrl,
                thoiGianSua: new Date(),
            };

            // Chuyển đổi các trường số
            [
                'idHangXe',
                'idLoaiXe',
                'namSanXuat',
                'sucChua',
                'giaTheoNgay',
                'giaTheoGio',
                'trangThai',
            ].forEach((field) => {
                if (updateData[field]) {
                    updateData[field] = Number(updateData[field]);
                }
            });

            await this.model.update(updateData, {
                where: { id: id },
            });

            const updatedXe = await this.model.findByPk(id);

            res.status(200).json({
                status: true,
                message: 'Cập nhật thành công',
                data: updatedXe,
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                error.message || 'Có lỗi xảy ra khi cập nhật xe'
            );
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
            return this.handleInternalError(res, error);
        }
    }

    async getDetail(req, res) {
        try {
            const xe = await this.model.findByPk(req.params.id, {
                include: [
                    {
                        model: HangXe,
                        attributes: ['tenHangXe'],
                    },
                    {
                        model: LoaiXe,
                        attributes: ['tenLoaiXe'],
                    },
                ],
            });
            res.status(200).json({
                data: xe,
            });
        } catch (error) {
            return this.handleInternalError(res, error);
        }
    }
}

module.exports = new XeRouterController();
