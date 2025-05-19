const Controller = require('./Controller');
const { HangXe } = require('../models');

class HangXeController extends Controller {
    constructor() {
        super(HangXe);
    }

    async getData(req, res) {
        const data = await this.model.findAll();
        res.json({
            data: data
        });
    }
    
    async delete(req, res) {
        const hangXe = await this.model.findOne({ where: { id: req.body.id } });
        if(hangXe) {
            await hangXe.destroy();
            res.json({
                'status': true,
                'message': 'Xóa thành công!'
            });
        } else {
            res.json({
                'status': false,
                'message': 'Không tìm thấy hãng xe!'
            });
        }
    }

    async update(req, res) {
        const hangXe = await this.model.findOne({ where: { id: req.body.id } });
        if(hangXe) {
            await hangXe.update({ tenHangXe: req.body.tenHangXe });
            res.json({
                'status': true,
                'message': 'Cập nhật thành công!'
            });
        } else {
            res.json({
                'status': false,
                'message': 'Không tìm thấy hãng xe!'
            });
        }
    }

    async create(req, res) {
        const { tenHangXe } = req.body;
        const hangXe = await this.model.findOne({ where: { tenHangXe } });
        if(hangXe) {
            res.json({
                'status': false,
                'message': 'Hãng xe đã tồn tại!'
            });
        } else {
            await this.model.create({ tenHangXe });
            res.json({
                'status': true,
                'message': 'Thêm hãng xe thành công!'
            });
        }
    }

    async changeStatus(req, res) {
        const hangXe = await this.model.findOne({ where: { id: req.params.id } });
        if(hangXe) {
            hangXe.trangThai = !hangXe.trangThai;
            await hangXe.save();
            res.json({
                'status': true,
                'message': 'Cập nhật trạng thái thành công!'
            });
        } else {
            res.json({
                'status': false,
                'message': 'Không tìm thấy hãng xe!'
            });
        }
    }
}

module.exports = new HangXeController();
