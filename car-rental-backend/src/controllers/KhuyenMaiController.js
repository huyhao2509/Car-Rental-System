const Controller = require('./Controller');
const { KhuyenMai } = require('../models');

class KhuyenMaiController extends Controller {
    constructor() {
        super(KhuyenMai);
    }

    async layDanhSachKhuyenMai(req, res) {
        const khuyenMai = await KhuyenMai.findAll();
        res.status(200).json({
            status: true,
            data: khuyenMai,
        });
    }

    async themKhuyenMai(req, res) {
        await KhuyenMai.create(req.body);
        res.status(200).json({
            status: true,
            message: 'Thêm khuyến mãi thành công',
        });
    }

    async capNhatKhuyenMai(req, res) {
        await KhuyenMai.update(req.body, {
            where: { id: req.body.id },
        });
        res.status(200).json({
            status: true,
            message: 'Cập nhật khuyến mãi thành công',
        });
    }

    async xoaKhuyenMai(req, res) {
        await KhuyenMai.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            status: true,
            message: 'Xóa khuyến mãi thành công',
        });
    }
}
module.exports = new KhuyenMaiController();
