const { Op } = require('sequelize');
const ResponseUtil = require('../utils/ResponseUtil');

class Controller {
    constructor(model) {
        this.model = model;
    }

    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            return ResponseUtil.success(res, items, 'Lấy dữ liệu thành công');
        } catch (error) {
            return ResponseUtil.error(res, 'Lỗi server', 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return ResponseUtil.error(res, 'Không tìm thấy dữ liệu', 404);
            }

            return ResponseUtil.success(res, item, 'Lấy dữ liệu thành công');
        } catch (error) {
            return ResponseUtil.error(res, 'Lỗi server', 500, error.message);
        }
    }

    async create(req, res) {
        try {
            const newItem = await this.model.create({
                ...req.body,
                thoiGianTao: new Date(),
                thoiGianSua: new Date(),
            });

            return ResponseUtil.success(res, newItem, 'Tạo mới thành công');
        } catch (error) {
            return ResponseUtil.error(res, 'Lỗi server', 500, error.message);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return ResponseUtil.error(res, 'Không tìm thấy dữ liệu', 404);
            }

            await item.update({
                ...req.body,
                thoiGianSua: new Date(),
            });

            return ResponseUtil.success(res, item, 'Cập nhật thành công');
        } catch (error) {
            return ResponseUtil.error(res, 'Lỗi server', 500, error.message);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return ResponseUtil.error(res, 'Không tìm thấy dữ liệu', 404);
            }

            await item.update({
                trangThai: 0,
                thoiGianSua: new Date(),
            });

            return ResponseUtil.success(res, null, 'Xóa thành công');
        } catch (error) {
            return ResponseUtil.error(res, 'Lỗi server', 500, error.message);
        }
    }

    async getPagination(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                sortBy = 'id',
                sortType = 'DESC',
            } = req.query;
            const offset = (page - 1) * limit;
            const whereCondition = {};
            if (search) {
                const searchableFields = Object.keys(this.model.rawAttributes).filter((field) =>
                    ['STRING', 'TEXT'].includes(this.model.rawAttributes[field].type.key)
                );

                whereCondition[Op.or] = searchableFields.map((field) => ({
                    [field]: { [Op.like]: `%${search}%` },
                }));
            }

            const { count, rows } = await this.model.findAndCountAll({
                where: whereCondition,
                offset: parseInt(offset),
                limit: parseInt(limit),
                order: [[sortBy, sortType]],
            });

            return ResponseUtil.paginated(
                res,
                rows,
                {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalItems: count,
                },
                'Lấy dữ liệu thành công'
            );
        } catch (error) {
            return ResponseUtil.error(res, 'Lỗi server', 500, error.message);
        }
    }
}

module.exports = Controller;
