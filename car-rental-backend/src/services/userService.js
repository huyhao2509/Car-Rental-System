const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const bcrypt = require('bcrypt');

// Kiểm tra tài khoản email đã tồn tại chưa
const checkUserExists = async (email) => {
    try {
        const user = await db.NguoiDung.findOne({ where: { email } });
        return user ? user : null;
    } catch (error) {
        console.error('Error checking user:', error);
        throw new Error('Database error when checking user');
    }
};

// Tạo tài khoản người dùng mới nếu chưa tồn tại
const createUserIfNotExists = async (email) => {
    try {
        const userExists = await checkUserExists(email);

        if (userExists) {
            return userExists;
        }

        // Nếu user chưa tồn tại, tạo mới
        const newUser = await db.NguoiDung.create({
            maNguoiDung: uuidv4(),
            email: email,
            maQuyen: 2, // User thường
            maTrangThaiTaiKhoan: 1, // Tài khoản hoạt động
        });
        return newUser;
    } catch (error) {
        console.error('Error creating/getting user:', error);
        throw new Error('Failed to create or get user');
    }
};

// Lấy thông tin người dùng theo email
const getUserByEmail = async (email) => {
    try {
        const user = await db.NguoiDung.findOne({ where: { email } });
        return user ? user : null;
    } catch (error) {
        console.error('Error getting user:', error);
        throw new Error('Failed to get user information');
    }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (userId) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: {
                maNguoiDung: userId,
                maTrangThaiTaiKhoan: 1, // Chỉ lấy tài khoản đang hoạt động
            },
        });
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw new Error('Failed to get user information');
    }
};

// Đăng ký tài khoản mới
const createUser = async (userData) => {
    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await checkUserExists(userData.email);
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }

        // Mã hóa mật khẩu
        let hashedPassword = null;
        if (userData.matKhau) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(userData.matKhau, salt);
        }

        // Tạo người dùng mới
        const user = await db.NguoiDung.create({
            maNguoiDung: uuidv4(),
            email: userData.email,
            matKhau: hashedPassword,
            tenNguoiDung: userData.tenNguoiDung,
            soDienThoai: userData.soDienThoai,
            maQuyen: userData.maQuyen || 2, // Mặc định là user thường
            maTrangThaiTaiKhoan: userData.maTrangThaiTaiKhoan || 1, // Mặc định là hoạt động
        });
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Cập nhật thông tin người dùng
const updateUser = async (userId, updateData) => {
    try {
        // Nếu có cập nhật mật khẩu thì mã hóa
        if (updateData.matKhau) {
            const salt = await bcrypt.genSalt(10);
            updateData.matKhau = await bcrypt.hash(updateData.matKhau, salt);
        }

        await db.NguoiDung.update(updateData, {
            where: { maNguoiDung: userId },
        });

        return await getUserById(userId);
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user information');
    }
};

// Xác thực đăng nhập bằng email và mật khẩu
const authenticateUser = async (email, password) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: {
                email,
                maTrangThaiTaiKhoan: 1, // Chỉ cho phép tài khoản hoạt động đăng nhập
            },
        });

        if (!user) {
            return {
                success: false,
                message: 'Email không tồn tại hoặc tài khoản đã bị khóa',
            };
        }

        if (!user.matKhau) {
            return {
                success: false,
                message: 'Tài khoản này chưa thiết lập mật khẩu. Vui lòng sử dụng đăng nhập OTP.',
            };
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.matKhau);
        if (!isPasswordValid) {
            return { success: false, message: 'Mật khẩu không chính xác' };
        }

        return {
            success: true,
            user: {
                id: user.maNguoiDung,
                email: user.email,
                name: user.tenNguoiDung,
                phone: user.soDienThoai,
                role: user.maQuyen,
            },
        };
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw new Error('Lỗi xác thực người dùng');
    }
};

// Đổi mật khẩu
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { success: false, message: 'Không tìm thấy người dùng' };
        }

        // Kiểm tra mật khẩu cũ
        if (user.matKhau) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.matKhau);
            if (!isPasswordValid) {
                return { success: false, message: 'Mật khẩu cũ không chính xác' };
            }
        }

        // Mã hóa và cập nhật mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.NguoiDung.update({ matKhau: hashedPassword }, { where: { maNguoiDung: userId } });

        return { success: true, message: 'Đổi mật khẩu thành công' };
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Lỗi khi đổi mật khẩu');
    }
};

module.exports = {
    checkUserExists,
    createUserIfNotExists,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    authenticateUser,
    changePassword,
};
