const Controller = require('./Controller');
const { NguoiDung } = require('../models/index.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class NguoiDungController extends Controller {
    constructor() {
        super(NguoiDung);
    }

    async register(req, res) {
        try {
            const { hoTen, email, password, soDienThoai } = req.body;
            const existingUser = await NguoiDung.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email đã được sử dụng'
                });
            }

            const existingPhone = await NguoiDung.findOne({ where: { soDienThoai } });
            if (existingPhone) {
                return res.status(400).json({
                    status: false,
                    message: 'Số điện thoại đã được sử dụng'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            return await super.create({
                ...req,
                body: {
                    hoTen,
                    email,
                    password: hashedPassword,
                    soDienThoai,
                    idChucVu: 2,
                    trangThai: 1
                }
            }, res);
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const nguoiDung = await NguoiDung.findOne({ 
                where: { email },
                include: ['ChucVu']
            });

            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            if (nguoiDung.trangThai !== 1) {
                return res.status(400).json({
                    status: false,
                    message: 'Tài khoản đã bị khóa'
                });
            }

            const validPassword = await bcrypt.compare(password, nguoiDung.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            const token = jwt.sign(
                { 
                    id: nguoiDung.id,
                    email: nguoiDung.email,
                    chucVu: nguoiDung.ChucVu.tenChucVu
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = nguoiDung.toJSON();

            return res.status(200).json({
                status: true,
                message: 'Đăng nhập thành công',
                data: {
                    token,
                    user: userWithoutPassword
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

    async checkLogin(req, res) {
        try {
            const { token } = req.body;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const nguoiDung = await NguoiDung.findOne({ where: { id: decoded.id }, include: ['ChucVu'] });
            const { password: _, ...nguoiDungWithoutPassword } = nguoiDung.toJSON();    
            return res.status(200).json({
                status: true,
                message: 'Đăng nhập thành công',
                data: nguoiDungWithoutPassword
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const nguoiDung = await NguoiDung.findAll({ include: ['ChucVu'] });
            return res.status(200).json({
                data: nguoiDung
            });
        } catch (error) {
            return res.status(500).json({
                 error: error.message
            });
        }
    }

    async createAdmin(req, res) {
        try {
            const { hoTen, email, soDienThoai, trangThai } = req.body;
            const existingUser = await NguoiDung.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email đã được sử dụng'
                });
            }

            const existingPhone = await NguoiDung.findOne({ where: { soDienThoai } });
            if (existingPhone) {
                return res.status(400).json({
                    status: false,
                    message: 'Số điện thoại đã được sử dụng'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            return await super.create({
                ...req,
                body: {
                    hoTen,
                    email,
                    password: hashedPassword,
                    soDienThoai,
                    idChucVu: 2,
                    trangThai: trangThai
                }
            }, res);
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async updateAdmin(req, res) {
        try {
            const nguoiDung = await this.model.findOne({ where: { id: req.body.id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            await nguoiDung.update(req.body);

            return res.status(200).json({
                status: true,
                message: 'Cập nhật tài khoản admin thành công',
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async deleteAdmin(req, res) {
        try {
            const { id } = req.params;
            const nguoiDung = await this.model.findOne({ where: { id: id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            await nguoiDung.destroy();

            return res.status(200).json({
                status: true,
                message: 'Xóa tài khoản admin thành công',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async changeStatus(req, res) {
        try {
            const { id } = req.params;
            const nguoiDung = await this.model.findOne({ where: { id: id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            nguoiDung.trangThai = nguoiDung.trangThai === 1 ? 2 : 1;
            await nguoiDung.save();

            return res.status(200).json({
                status: true,
                message: 'Cập nhật trạng thái thành công',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            const {id, password_new } = req.body;
            const nguoiDung = await this.model.findOne({ where: { id: id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password_new, salt);

            nguoiDung.password = hashedPassword;
            await nguoiDung.save();

            return res.status(200).json({
                status: true,
                message: 'Đổi mật khẩu thành công',
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

module.exports = new NguoiDungController();
