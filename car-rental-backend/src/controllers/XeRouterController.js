const Controller = require('./Controller');
const { Xe, HangXe, LoaiXe, Sequelize } = require('../models');
const { Op } = Sequelize;

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
            // Kiểm tra biển số xe đã tồn tại chưa
            const bienSoXe = req.body.bienSoXe;
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
            
            const xe = await this.model.create({
                ...req.body,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            });
            res.status(200).json({
                status: true,
                message: 'Tạo mới thành công',
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const bienSoXe = req.body.bienSoXe;
            if (!bienSoXe) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe không được để trống',
                });
            }

            const xeExists = await this.model.findOne({
                where: { 
                    bienSoXe: bienSoXe, 
                    id: { [Op.ne]: req.body.id } 
                }
            });
            
            if (xeExists) {
                return res.status(400).json({
                    status: false,
                    message: 'Biển số xe đã tồn tại trong hệ thống',
                });
            }
            
            const xe = await this.model.update(
                {
                    ...req.body,
                    thoiGianSua: new Date()
                }, 
                {
                    where: { id: req.body.id }
                }
            );
            
            res.status(200).json({
                status: true,
                message: 'Cập nhật thành công',
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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
