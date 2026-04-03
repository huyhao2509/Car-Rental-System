import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '@/utils/Api';

// Tạo context
const AuthContext = createContext();

// Hook để sử dụng context này
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getErrorMessage = (error, fallbackMessage) => {
        return error?.data?.message || error?.response?.data?.message || fallbackMessage;
    };

    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await Api.post('/nguoi-dung/check-login', {
                    token
                });

                if (res.data.status) {
                    setCurrentUser(res.data.data);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    // Đăng ký tài khoản mới
    const register = async (fullName, email, password, phone) => {
        try {
            const res = await Api.post('/nguoi-dung/register', {
                hoTen: fullName,
                email,
                password,
                soDienThoai: phone
            });

            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'Đã xảy ra lỗi khi đăng ký')
            );
        }
    };

    // Đăng nhập bằng email/password
    const login = async (email, password) => {
        try {
            const res = await Api.post('/nguoi-dung/login', {
                email,
                password
            });

            if (res.data.status) {
                localStorage.setItem('token', res.data.data.token);

                // Cập nhật trạng thái
                setCurrentUser(res.data.data.user);
                setIsAuthenticated(true);
            }

            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'Email hoặc mật khẩu không chính xác')
            );
        }
    };

    // Gửi OTP
    const sendOTP = async (email) => {
        try {
            const res = await Api.post('/nguoi-dung/send-otp', { email });
            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'Không thể gửi OTP')
            );
        }
    };

    // Xác thực OTP
    const verifyOTP = async (email, otp) => {
        try {
            const res = await Api.post('/nguoi-dung/verify-otp', {
                email,
                otp
            });

            if (res.data.success) {
                // Lưu token vào localStorage
                localStorage.setItem('token', res.data.data.token);

                // Cập nhật trạng thái
                setCurrentUser(res.data.data.user);
                setIsAuthenticated(true);
            }

            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'OTP không hợp lệ')
            );
        }
    };

    // Quên mật khẩu
    const forgotPassword = async (email) => {
        try {
            const res = await Api.post('/nguoi-dung/forgot-password', { email });
            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'Không thể xử lý yêu cầu quên mật khẩu')
            );
        }
    };

    // Đặt lại mật khẩu
    const resetPassword = async (email, oldPassword, newPassword) => {
        try {
            const res = await Api.post('/nguoi-dung/reset-password', {
                email,
                oldPassword,
                newPassword
            });
            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'Không thể đặt lại mật khẩu')
            );
        }
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    // Kiểm tra xem người dùng có phải là admin hay không
    const isAdmin = () => {
        return currentUser && currentUser.idChucVu === 1;
    };

    // Hàm chuyển hướng dựa vào quyền
    const redirectBasedOnRole = () => {
        if (isAdmin()) {
            navigate('/admin/dashboard');
        } else {
            navigate('/');
        }
    };

    // Cập nhật thông tin người dùng
    const updateUserInfo = async (userData) => {
        try {
            const res = await Api.post('/nguoi-dung/profile/update', userData);
            if (res.data.success) {
                setCurrentUser({
                    ...currentUser,
                    ...res.data.user
                });
                return res.data;
            }

            return res.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error, 'Lỗi khi cập nhật thông tin')
            );
        }
    };

    // Làm mới thông tin người dùng từ server
    const refreshUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const res = await Api.get('/nguoi-dung/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.status) {
                setCurrentUser(res.data.data);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Lỗi khi làm mới thông tin người dùng:', error);
            return false;
        }
    };

    const contextValue = {
        user: currentUser,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        loading,
        register,
        login,
        sendOTP,
        verifyOTP,
        logout,
        isAdmin,
        redirectBasedOnRole,
        updateUserInfo,
        refreshUserInfo,
        forgotPassword,
        resetPassword
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
