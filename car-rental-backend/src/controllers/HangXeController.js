const Controller = require('./Controller');
const { HangXe } = require('../models');

class HangXeController extends Controller {
    constructor() {
        super(HangXe);
    }

    _buildResponse(status, message) {
        return { status, message };
    }

    _getRequestId(req) {
        return req.params?.id || req.body?.id;
    }

    async getData(req, res) {
        const data = await this.model.findAll();
        return res.json({ data });
    }

    async delete(req, res) {
        const id = this._getRequestId(req);
        const hangXe = await this.model.findOne({ where: { id } });

        if (!hangXe) {
            return res.json(this._buildResponse(false, 'Không tìm thấy hãng xe!'));
        }

        await hangXe.destroy();
        return res.json(this._buildResponse(true, 'Xóa thành công!'));
    }

    async update(req, res) {
        const id = this._getRequestId(req);
        const hangXe = await this.model.findOne({ where: { id } });

        if (!hangXe) {
            return res.json(this._buildResponse(false, 'Không tìm thấy hãng xe!'));
        }

        await hangXe.update({ tenHangXe: req.body.tenHangXe });
        return res.json(this._buildResponse(true, 'Cập nhật thành công!'));
    }

    async create(req, res) {
        const { tenHangXe } = req.body;
        const normalizedName = String(tenHangXe || '').trim();
        const hangXe = await this.model.findOne({ where: { tenHangXe: normalizedName } });

        if (hangXe) {
            return res.json(this._buildResponse(false, 'Hãng xe đã tồn tại!'));
        }

        await this.model.create({ tenHangXe: normalizedName });
        return res.json(this._buildResponse(true, 'Thêm hãng xe thành công!'));
    }

    async changeStatus(req, res) {
        const id = this._getRequestId(req);
        const hangXe = await this.model.findOne({ where: { id } });

        if (!hangXe) {
            return res.json(this._buildResponse(false, 'Không tìm thấy hãng xe!'));
        }

        hangXe.trangThai = !hangXe.trangThai;
        await hangXe.save();
        return res.json(this._buildResponse(true, 'Cập nhật trạng thái thành công!'));
    }
}

module.exports = new HangXeController();
