const Controller = require('./Controller');
const { LoaiXe } = require('../models');

class LoaiXeController extends Controller {
    constructor() {
        super(LoaiXe);
    }

    async getAll(req, res) {
        const loaiXe = await this.model.findAll();
        res.json({
            data: loaiXe,
        });
    }

    async update(req, res) {
        const loaiXe = await this.model.findOne({ where: { id: req.body.id } });
        if (loaiXe) {
            await loaiXe.update(req.body);
            res.json({
                status: true,
                message: 'Cập nhật thành công!',
            });
        } else {
            res.json({
                status: false,
                message: 'Không tìm thấy loại xe!',
            });
        }
    }

    async create(req, res) {
        const { tenLoaiXe } = req.body;
        const loaiXe = await this.model.findOne({ where: { tenLoaiXe } });

        if (loaiXe) {
            res.json({
                status: false,
                message: 'Loại xe đã tồn tại!',
            });
        } else {
            await this.model.create({ tenLoaiXe, trangThai: 1 });
            res.json({
                status: true,
                message: 'Thêm loại xe thành công!',
            });
        }
    }

    async delete(req, res) {
        const loaiXe = await this.model.findOne({ where: { id: req.params.id } });
        if (loaiXe) {
            await loaiXe.destroy();
            res.json({
                status: true,
                message: 'Xóa loại xe thành công!',
            });
        } else {
            res.json({
                status: false,
                message: 'Không tìm thấy loại xe!',
            });
        }
    }

    async changeStatus(req, res) {
        const loaiXe = await this.model.findOne({ where: { id: req.params.id } });
        if (loaiXe) {
            loaiXe.trangThai = !loaiXe.trangThai;
            await loaiXe.save();
            res.json({
                status: true,
                message: 'Cập nhật trạng thái thành công!',
            });
        } else {
            res.json({
                status: false,
                message: 'Không tìm thấy loại xe!',
            });
        }
    }
}

module.exports = new LoaiXeController();
