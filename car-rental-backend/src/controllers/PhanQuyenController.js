const Controller = require('./Controller');
const { ChucVu, ChucNang } = require('../models');

class PhanQuyenController extends Controller {
    constructor() {
        super(ChucVu);
    }

    async getAll(req, res) {
        const phanQuyens = await this.model.findAll();
        res.json({
            data: phanQuyens,
        });
    }


    async create(req, res) {
        const { tenChucVu, trangThai } = req.body;
        await this.model.create({ tenChucVu, trangThai });
        res.json({
            status: true,
            message: 'Tạo chức vụ thành công',
        });
    }

    async update(req, res) {
        const { id, tenChucVu, trangThai } = req.body;
        await this.model.update({ tenChucVu, trangThai }, { where: { id } });
        res.json({
            status: true,
            message: 'Cập nhật chức vụ thành công',
        });
    }

    async delete(req, res) {
        const { id } = req.params;
        await this.model.destroy({ where: { id } });
        res.json({
            status: true,
            message: 'Xóa chức vụ thành công',
        });
    }

    async changeStatus(req, res) {
        const { id } = req.params;
        if (id == 1 || id == 2) {
            res.json({
                status: false,
                message: 'Không được đổi trạng thái chức vụ này',
            });
            return;
        }
        const chucVu = await this.model.findByPk(id);
        chucVu.trangThai = !chucVu.trangThai;
        await chucVu.save();
        res.json({
            status: true,
            message: 'Cập nhật trạng thái thành công',
        });
    }

    async getAllChucNang(req, res) {
        const chucNangs = await ChucNang.findAll({
            order: [
                ['id', 'ASC'],
            ],
        });
        res.json({
            data: chucNangs,
        });
    }

    async changeStatusChucNang(req, res) {
        const { id } = req.params;
        const chucNang = await ChucNang.findByPk(id);
        chucNang.trangThai = !chucNang.trangThai;
        await chucNang.save();
        res.json({
            status: true,
            message: 'Cập nhật trạng thái thành công',
        });
    }
}

module.exports = new PhanQuyenController();
