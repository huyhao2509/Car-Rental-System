const Controller = require('./Controller');
const { ChucVu, ChucNang, ChiTietPhanQuyen, NguoiDung } = require('../models');
const { Op } = require('sequelize');

class PhanQuyenController extends Controller {
    constructor() {
        super(ChucVu);
    }

    handleInternalError(res, error, message, logMessage) {
        console.error(logMessage, error);
        return res.status(500).json({
            status: false,
            message,
            error: error.message
        });
    }

    async getAll(req, res) {
        try {
            const phanQuyens = await this.model.findAll({
                order: [['id', 'ASC']]
            });
            res.json({
                status: true,
                data: phanQuyens,
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi lấy danh sách chức vụ',
                'Lỗi khi lấy danh sách chức vụ:'
            );
        }
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
        try {
            const chucNangs = await ChucNang.findAll({
                order: [
                    ['id', 'ASC'],
                ],
            });
            res.json({
                status: true,
                data: chucNangs,
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi lấy danh sách chức năng',
                'Lỗi khi lấy danh sách chức năng:'
            );
        }
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

    // Các phương thức mới cho phân quyền chi tiết

    // Lấy danh sách quyền của một chức vụ
    async getPermissionsByRole(req, res) {
        try {
            const { idChucVu } = req.params;
            
            // Kiểm tra chức vụ có tồn tại không
            const chucVu = await ChucVu.findByPk(idChucVu);
            if (!chucVu) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy chức vụ'
                });
            }

            // Lấy tất cả các chức năng trong hệ thống
            const allChucNangs = await ChucNang.findAll({
                order: [['id', 'ASC']]
            });

            // Lấy các quyền đã được cấp cho chức vụ này
            const assignedPermissions = await ChiTietPhanQuyen.findAll({
                where: { idChucVu }
            });

            // Tạo mảng ID của các chức năng đã được cấp
            const assignedPermissionIds = assignedPermissions.map(p => p.idChucNang);

            // Tạo danh sách kết quả với trạng thái đã được cấp
            const result = allChucNangs.map(chucNang => ({
                id: chucNang.id,
                tenChucNang: chucNang.tenChucNang,
                trangThai: chucNang.trangThai,
                assigned: assignedPermissionIds.includes(chucNang.id)
            }));

            res.json({
                status: true,
                data: result,
                role: chucVu
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi lấy thông tin phân quyền',
                'Lỗi khi lấy thông tin phân quyền:'
            );
        }
    }

    // Cập nhật phân quyền cho một chức vụ
    async updatePermissions(req, res) {
        try {
            const { idChucVu, permissions } = req.body;

            const chucVu = await ChucVu.findByPk(idChucVu);
            if (!chucVu) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy chức vụ'
                });
            }

            await ChiTietPhanQuyen.destroy({
                where: { idChucVu }
            });

            // Nếu có quyền mới được chọn
            if (permissions && permissions.length > 0) {
                // Tạo bản ghi mới cho từng quyền được chọn
                const now = new Date();
                const permissionRecords = permissions.map(idChucNang => ({
                    idChucVu,
                    idChucNang,
                    thoiGianTao: now,
                    thoiGianSua: now
                }));
                await ChiTietPhanQuyen.bulkCreate(permissionRecords);
            }

            res.json({
                status: true,
                message: 'Cập nhật phân quyền thành công'
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi cập nhật phân quyền',
                'Lỗi khi cập nhật phân quyền:'
            );
        }
    }

    // Kiểm tra quyền của một người dùng
    async checkUserPermissions(req, res) {
        try {
            const { idNguoiDung } = req.params;
            const { required } = req.body;

            // Giả sử NguoiDung có quan hệ với ChucVu và bạn có thể truy cập idChucVu
            const user = await NguoiDung.findByPk(idNguoiDung, {
                attributes: ['id', 'hoTen', 'idChucVu']
            });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            // Lấy các quyền của chức vụ người dùng
            const userPermissions = await ChiTietPhanQuyen.findAll({
                where: { idChucVu: user.idChucVu },
                include: [{
                    model: ChucNang,
                    attributes: ['tenChucNang', 'trangThai'],
                    where: { trangThai: 1 } // Chỉ lấy các chức năng đang hoạt động
                }]
            });

            // Lấy danh sách id chức năng của người dùng
            const permissionIds = userPermissions.map(p => p.idChucNang);

            // Kiểm tra xem người dùng có tất cả quyền cần thiết hay không
            const hasAllRequiredPermissions = required.every(permId => permissionIds.includes(permId));

            res.json({
                status: true,
                hasPermission: hasAllRequiredPermissions,
                userPermissions: permissionIds
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi kiểm tra quyền người dùng',
                'Lỗi khi kiểm tra quyền người dùng:'
            );
        }
    }

    // Tạo mới chức năng
    async createChucNang(req, res) {
        try {
            const { tenChucNang, trangThai } = req.body;
            
            const newChucNang = await ChucNang.create({
                tenChucNang,
                trangThai,
                thoiGianTao: new Date(),
                thoiGianSua: new Date()
            });
            
            res.json({
                status: true,
                message: 'Tạo chức năng thành công',
                data: newChucNang
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi tạo chức năng mới',
                'Lỗi khi tạo chức năng mới:'
            );
        }
    }

    // Cập nhật chức năng
    async updateChucNang(req, res) {
        try {
            const { id, tenChucNang, trangThai } = req.body;
            
            const chucNang = await ChucNang.findByPk(id);
            if (!chucNang) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy chức năng'
                });
            }
            
            await chucNang.update({
                tenChucNang,
                trangThai,
                thoiGianSua: new Date()
            });
            
            res.json({
                status: true,
                message: 'Cập nhật chức năng thành công',
                data: chucNang
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi cập nhật chức năng',
                'Lỗi khi cập nhật chức năng:'
            );
        }
    }

    // Xóa chức năng
    async deleteChucNang(req, res) {
        try {
            const { id } = req.params;
            
            const chucNang = await ChucNang.findByPk(id);
            if (!chucNang) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy chức năng'
                });
            }
            
            // Xóa các bản ghi liên quan trong ChiTietPhanQuyen
            await ChiTietPhanQuyen.destroy({
                where: { idChucNang: id }
            });
            
            // Xóa chức năng
            await chucNang.destroy();
            
            res.json({
                status: true,
                message: 'Xóa chức năng thành công'
            });
        } catch (error) {
            return this.handleInternalError(
                res,
                error,
                'Đã có lỗi xảy ra khi xóa chức năng',
                'Lỗi khi xóa chức năng:'
            );
        }
    }
}

module.exports = new PhanQuyenController();
