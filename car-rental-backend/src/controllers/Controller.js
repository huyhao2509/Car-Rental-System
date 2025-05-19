const { Op } = require('sequelize');

class Controller {
    constructor(model) {
        this.model = model;
    }

    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            return res.status(200).json({
                status: true,
                message: 'Lấy dữ liệu thành công',
                data: items
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);
            
            if (!item) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy dữ liệu'
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Lấy dữ liệu thành công',
                data: item
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async create(req, res) {
        console.log(this.model);
        
        try {
            const newItem = await this.model.create({
                ...req.body,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            });

            return res.status(200).json({
                status: true,
                message: 'Tạo mới thành công',
                data: newItem
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy dữ liệu'
                });
            }

            await item.update({
                ...req.body,
                thoiGianSua: new Date()
            });

            return res.status(200).json({
                status: true,
                message: 'Cập nhật thành công',
                data: item
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findByPk(id);

            if (!item) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy dữ liệu'
                });
            }

            await item.update({
                trangThai: 0,
                thoiGianSua: new Date()
            });

            return res.status(200).json({
                status: true,
                message: 'Xóa thành công'
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async getPagination(req, res) {
        try {
            const { page = 1, limit = 10, search = '', sortBy = 'id', sortType = 'DESC' } = req.query;
            const offset = (page - 1) * limit;
            const whereCondition = {};
            if (search) {
                const searchableFields = Object.keys(this.model.rawAttributes).filter(
                    field => ['STRING', 'TEXT'].includes(this.model.rawAttributes[field].type.key)
                );
                
                whereCondition[Op.or] = searchableFields.map(field => ({
                    [field]: { [Op.like]: `%${search}%` }
                }));
            }

            const { count, rows } = await this.model.findAndCountAll({
                where: whereCondition,
                offset: parseInt(offset),
                limit: parseInt(limit),
                order: [[sortBy, sortType]]
            });

            return res.status(200).json({
                status: true,
                message: 'Lấy dữ liệu thành công',
                data: {
                    items: rows,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalItems: count,
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }
}

module.exports = Controller;
