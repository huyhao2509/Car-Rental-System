const Controller = require('./Controller');
const { NguoiDung } = require('../models/index.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otpService');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');
const PinataService = require('../services/PinataService');

class NguoiDungController extends Controller {
    constructor() {
        super(NguoiDung);
    }

    handleServerError(res, error, options = {}) {
        const {
            responseKey = 'status',
            logMessage = null,
            message = 'Lỗi server',
            errorValue = null,
        } = options;

        if (logMessage) {
            console.error(logMessage, error);
        }

        return res.status(500).json({
            [responseKey]: false,
            message,
            error: errorValue || error.message,
        });
    }

    async register(req, res) {
        try {
            const { hoTen, email, password, soDienThoai } = req.body;
            const existingUser = await NguoiDung.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email đã được sử dụng',
                });
            }

            const existingPhone = await NguoiDung.findOne({ where: { soDienThoai } });
            if (existingPhone) {
                return res.status(400).json({
                    status: false,
                    message: 'Số điện thoại đã được sử dụng',
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            return await super.create(
                {
                    ...req,
                    body: {
                        hoTen,
                        email,
                        password: hashedPassword,
                        soDienThoai,
                        idChucVu: 2,
                        trangThai: 1,
                    },
                },
                res
            );
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const nguoiDung = await NguoiDung.findOne({
                where: { email },
                include: ['ChucVu'],
            });

            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Email hoặc mật khẩu không đúng',
                });
            }

            if (nguoiDung.trangThai !== 1) {
                return res.status(400).json({
                    status: false,
                    message: 'Tài khoản đã bị khóa',
                });
            }

            const validPassword = await bcrypt.compare(password, nguoiDung.password);
            if (!validPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Email hoặc mật khẩu không đúng',
                });
            }

            const token = jwt.sign(
                {
                    id: nguoiDung.id,
                    email: nguoiDung.email,
                    idChucVu: nguoiDung.idChucVu,
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
                    user: userWithoutPassword,
                },
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async checkLogin(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({
                    status: false,
                    message: 'Thiếu token đăng nhập',
                });
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (_error) {
                return res.status(401).json({
                    status: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                });
            }

            const nguoiDung = await NguoiDung.findOne({
                where: { id: decoded.id },
                include: ['ChucVu'],
            });
            if (!nguoiDung) {
                return res.status(404).json({
                    status: false,
                    message: 'Không tìm thấy người dùng',
                });
            }

            const { password: _, ...nguoiDungWithoutPassword } = nguoiDung.toJSON();
            return res.status(200).json({
                status: true,
                message: 'Đăng nhập thành công',
                data: nguoiDungWithoutPassword,
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async getAll(req, res) {
        try {
            const nguoiDung = await NguoiDung.findAll({ include: ['ChucVu'] });
            return res.status(200).json({
                data: nguoiDung,
            });
        } catch (error) {
            return this.handleServerError(res, error, { message: 'Lỗi lấy danh sách người dùng' });
        }
    }

    async createAdmin(req, res) {
        try {
            const { hoTen, email, soDienThoai, trangThai, idChucVu } = req.body;
            const existingUser = await NguoiDung.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email đã được sử dụng',
                });
            }

            const existingPhone = await NguoiDung.findOne({ where: { soDienThoai } });
            if (existingPhone) {
                return res.status(400).json({
                    status: false,
                    message: 'Số điện thoại đã được sử dụng',
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            return await super.create(
                {
                    ...req,
                    body: {
                        hoTen,
                        email,
                        password: hashedPassword,
                        soDienThoai,
                        idChucVu: idChucVu,
                        trangThai: trangThai,
                    },
                },
                res
            );
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async updateAdmin(req, res) {
        try {
            const nguoiDung = await this.model.findOne({ where: { id: req.body.id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            await nguoiDung.update(req.body);

            return res.status(200).json({
                status: true,
                message: 'Cập nhật tài khoản admin thành công',
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async deleteAdmin(req, res) {
        try {
            const { id } = req.params;
            const nguoiDung = await this.model.findOne({ where: { id: id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            await nguoiDung.destroy();

            return res.status(200).json({
                status: true,
                message: 'Xóa tài khoản admin thành công',
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async changeStatus(req, res) {
        try {
            const { id } = req.params;
            const nguoiDung = await this.model.findOne({ where: { id: id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            nguoiDung.trangThai = nguoiDung.trangThai === 1 ? 2 : 1;
            await nguoiDung.save();

            return res.status(200).json({
                status: true,
                message: 'Cập nhật trạng thái thành công',
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async changePassword(req, res) {
        try {
            const { id, password_new } = req.body;
            const nguoiDung = await this.model.findOne({ where: { id: id } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
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
            return this.handleServerError(res, error);
        }
    }

    async updateProfile(req, res) {
        try {
            const idNguoiDung = req.user.id;
            const fs = require('fs').promises;

            const nguoiDung = await this.model.findOne({ where: { id: idNguoiDung } });
            if (!nguoiDung) {
                return res.status(404).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            const { hoTen, soDienThoai, canCuocCongDan } = req.body;
            const updateData = {};

            if (hoTen !== undefined) updateData.hoTen = hoTen;
            if (soDienThoai !== undefined) updateData.soDienThoai = soDienThoai;
            if (canCuocCongDan !== undefined) updateData.canCuocCongDan = canCuocCongDan;
            if (req.files) {
                try {
                    if (req.files.anhCanCuoc && req.files.anhCanCuoc[0]) {
                        const file = req.files.anhCanCuoc[0];
                        const fileBuffer = await fs.readFile(file.path);

                        const cccdResult = await PinataService.uploadImage(
                            fileBuffer,
                            `cccd_${idNguoiDung}_${Date.now()}`,
                            idNguoiDung,
                            'cccd'
                        );
                        updateData.anhCanCuoc = cccdResult.gatewayUrl;

                        // Xóa file tạm sau khi upload
                        await fs.unlink(file.path);
                    }

                    if (req.files.anhBangLaiXe && req.files.anhBangLaiXe[0]) {
                        const file = req.files.anhBangLaiXe[0];
                        const fileBuffer = await fs.readFile(file.path);

                        const blxResult = await PinataService.uploadImage(
                            fileBuffer,
                            `banglai_${idNguoiDung}_${Date.now()}`,
                            idNguoiDung,
                            'banglai'
                        );
                        updateData.anhBangLaiXe = blxResult.gatewayUrl;

                        // Xóa file tạm sau khi upload
                        await fs.unlink(file.path);
                    }
                } catch (uploadError) {
                    return this.handleServerError(res, uploadError, {
                        logMessage: 'Lỗi upload file:',
                        message: 'Lỗi khi upload ảnh',
                    });
                }
            }

            await nguoiDung.update(updateData);

            const { password: _, ...updatedUser } = nguoiDung.toJSON();

            return res.status(200).json({
                status: true,
                message: 'Cập nhật thông tin cá nhân thành công',
                data: updatedUser,
            });
        } catch (error) {
            return this.handleServerError(res, error, { logMessage: 'Lỗi cập nhật profile:' });
        }
    }

    async getProfile(req, res) {
        try {
            const idNguoiDung = req.user.id;

            const nguoiDung = await this.model.findOne({
                where: { id: idNguoiDung },
                include: ['ChucVu'],
            });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            return res.status(200).json({
                status: true,
                data: nguoiDung,
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async uploadAvatar(req, res) {
        try {
            const idNguoiDung = req.user.id;

            const nguoiDung = await this.model.findOne({ where: { id: idNguoiDung } });
            if (!nguoiDung) {
                return res.status(400).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            if (req.file) {
                try {
                    // Tạo buffer từ file
                    const fileBuffer = req.file.buffer;
                    if (!fileBuffer) {
                        return res.status(400).json({
                            status: false,
                            message: 'Không thể đọc dữ liệu file',
                        });
                    }

                    // Upload ảnh lên Pinata
                    const result = await PinataService.uploadImage(
                        fileBuffer,
                        `avatar_${idNguoiDung}_${Date.now()}`,
                        idNguoiDung,
                        'avatar'
                    );

                    // Cập nhật URL ảnh vào database
                    nguoiDung.anhDaiDien = result.gatewayUrl;
                    await nguoiDung.save();

                    const { password: _, ...updatedUser } = nguoiDung.toJSON();

                    return res.status(200).json({
                        status: true,
                        message: 'Cập nhật ảnh đại diện thành công',
                        data: updatedUser,
                    });
                } catch (uploadError) {
                    return this.handleServerError(res, uploadError, {
                        logMessage: 'Lỗi upload avatar:',
                        message: 'Lỗi khi upload ảnh',
                    });
                }
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'Không tìm thấy file ảnh đại diện',
                });
            }
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async deleteCanCuoc(req, res) {
        try {
            const idNguoiDung = req.user.id;

            const nguoiDung = await this.model.findOne({ where: { id: idNguoiDung } });
            if (!nguoiDung) {
                return res.status(404).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            if (!nguoiDung.anhCanCuoc) {
                return res.status(400).json({
                    status: false,
                    message: 'Không có ảnh căn cước để xóa',
                });
            }

            // Lấy IPFS hash từ URL
            const ipfsHash = nguoiDung.anhCanCuoc.split('/').pop();

            // Xóa file từ Pinata
            await PinataService.deleteFile(ipfsHash);

            nguoiDung.anhCanCuoc = null;
            await nguoiDung.save();

            const { password: _, ...updatedUser } = nguoiDung.toJSON();

            return res.status(200).json({
                status: true,
                message: 'Xóa ảnh căn cước thành công',
                data: updatedUser,
            });
        } catch (error) {
            return this.handleServerError(res, error);
        }
    }

    async deleteBangLai(req, res) {
        try {
            const idNguoiDung = req.user.id;

            const nguoiDung = await this.model.findOne({ where: { id: idNguoiDung } });
            if (!nguoiDung) {
                return res.status(404).json({
                    status: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            if (!nguoiDung.anhBangLaiXe) {
                return res.status(400).json({
                    status: false,
                    message: 'Không có ảnh bằng lái để xóa',
                });
            }

            // Lấy IPFS hash từ URL
            const ipfsHash = nguoiDung.anhBangLaiXe.split('/').pop();

            // Xóa file từ Pinata
            await PinataService.deleteFile(ipfsHash);

            nguoiDung.anhBangLaiXe = null;
            await nguoiDung.save();

            const { password: _, ...updatedUser } = nguoiDung.toJSON();

            return res.status(200).json({
                status: true,
                message: 'Xóa ảnh bằng lái thành công',
                data: updatedUser,
            });
        } catch (error) {
            return this.handleServerError(res, error, { logMessage: 'Lỗi khi xóa ảnh bằng lái:' });
        }
    }

    /**
     * Gửi mã OTP tới email
     * @param {Object} req Request
     * @param {Object} res Response
     */
    async sendOTP(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email không được để trống',
                });
            }

            // Kiểm tra email có tồn tại trong hệ thống không
            const user = await NguoiDung.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Email chưa được đăng ký trong hệ thống',
                });
            }

            // Nếu tài khoản bị khóa
            if (user.trangThai !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên',
                });
            }

            // Tạo OTP ngẫu nhiên
            const otp = generateOTP();

            // Lưu OTP với email
            storeOTP(email, otp);

            // Gửi OTP qua email
            const emailResult = await sendOTPEmail(email, otp);

            if (!emailResult.success) {
                return this.handleServerError(
                    res,
                    new Error(emailResult.error || 'Không thể gửi email OTP'),
                    {
                        responseKey: 'success',
                        message: 'Không thể gửi email OTP',
                        errorValue: emailResult.error || 'Không xác định',
                        logMessage: 'Gửi OTP email thất bại:',
                    }
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Mã OTP đã được gửi tới email của bạn',
            });
        } catch (error) {
            return this.handleServerError(res, error, {
                responseKey: 'success',
                logMessage: 'Lỗi khi gửi OTP:',
            });
        }
    }

    /**
     * Xác thực OTP và đăng nhập
     * @param {Object} req Request
     * @param {Object} res Response
     */
    async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({
                    success: false,
                    message: 'Email và OTP không được để trống',
                });
            }

            // Xác thực OTP
            const isValid = verifyOTP(email, otp);

            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã OTP không hợp lệ hoặc đã hết hạn',
                });
            }

            // Tìm người dùng theo email
            const nguoiDung = await NguoiDung.findOne({
                where: { email },
                include: ['ChucVu'],
            });

            if (!nguoiDung) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            if (nguoiDung.trangThai !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa',
                });
            }

            // Tạo JWT token
            const token = jwt.sign(
                {
                    id: nguoiDung.id,
                    email: nguoiDung.email,
                    idChucVu: nguoiDung.idChucVu,
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = nguoiDung.toJSON();

            return res.status(200).json({
                success: true,
                message: 'Xác thực OTP thành công',
                data: {
                    token,
                    user: userWithoutPassword,
                },
            });
        } catch (error) {
            return this.handleServerError(res, error, {
                responseKey: 'success',
                logMessage: 'Lỗi khi xác thực OTP:',
            });
        }
    }

    /**
     * Xử lý quên mật khẩu
     * @param {Object} req Request
     * @param {Object} res Response
     */
    async forgotPassword(req, res) {
        try {
            const normalizedEmail = req.body?.email?.trim().toLowerCase();

            if (!normalizedEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email không được để trống',
                });
            }

            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                return res.status(500).json({
                    success: false,
                    message: 'Hệ thống email chưa được cấu hình, vui lòng liên hệ quản trị viên',
                });
            }

            // Kiểm tra email có tồn tại trong hệ thống không
            const user = await NguoiDung.findOne({ where: { email: normalizedEmail } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Email chưa được đăng ký trong hệ thống',
                });
            }

            // Nếu tài khoản bị khóa
            if (user.trangThai !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên',
                });
            }

            // Tạo mật khẩu ngẫu nhiên mới
            const newPassword = Math.random().toString(36).slice(-8);

            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const oldHashedPassword = user.password;

            // Cập nhật mật khẩu mới vào database
            user.password = hashedPassword;
            await user.save();

            // Gửi mật khẩu mới qua email
            const emailResult = await sendPasswordResetEmail(normalizedEmail, newPassword);

            if (!emailResult.success) {
                // Rollback lại mật khẩu cũ để tránh khóa người dùng khi gửi email thất bại
                user.password = oldHashedPassword;
                await user.save();

                return this.handleServerError(
                    res,
                    new Error(emailResult.error || 'Không thể gửi email chứa mật khẩu mới'),
                    {
                        responseKey: 'success',
                        message: 'Không thể gửi email chứa mật khẩu mới',
                        errorValue: emailResult.error || 'Không xác định',
                        logMessage: 'Gửi email mật khẩu mới thất bại:',
                    }
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Mật khẩu mới đã được gửi tới email của bạn',
            });
        } catch (error) {
            return this.handleServerError(res, error, {
                responseKey: 'success',
                logMessage: 'Lỗi khi xử lý quên mật khẩu:',
            });
        }
    }

    /**
     * Đặt lại mật khẩu
     * @param {Object} req Request
     * @param {Object} res Response
     */
    async resetPassword(req, res) {
        try {
            const { email, oldPassword, newPassword } = req.body;

            if (!email || !oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin cần thiết',
                });
            }

            // Tìm người dùng theo email
            const user = await NguoiDung.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng không tồn tại',
                });
            }

            // Nếu tài khoản bị khóa
            if (user.trangThai !== 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Tài khoản đã bị khóa',
                });
            }

            // Kiểm tra mật khẩu cũ
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Mật khẩu cũ không chính xác',
                });
            }

            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Cập nhật mật khẩu mới
            user.password = hashedPassword;
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Mật khẩu đã được cập nhật thành công',
            });
        } catch (error) {
            return this.handleServerError(res, error, {
                responseKey: 'success',
                logMessage: 'Lỗi khi đặt lại mật khẩu:',
            });
        }
    }
}

module.exports = new NguoiDungController();
