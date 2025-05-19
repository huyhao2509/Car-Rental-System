import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Tạo context
const AuthContext = createContext();

// Hook để sử dụng context này
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Thiết lập token trong header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            try {
                const res = await axios.post('/api/nguoi-dung/check-login', {
                    token
                });

                if (res.data.status) {
                    setCurrentUser(res.data.data);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            } catch (error) {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    // Đăng ký tài khoản mới
    const register = async (fullName, email, password, phone) => {
        try {
            const res = await axios.post('/api/auth/register', {
                fullName,
                email,
                password,
                phone
            });

            return res.data;
        } catch (error) {
            throw new Error(
                error.res?.data?.message || 'Đã xảy ra lỗi khi đăng ký'
            );
        }
    };

    // Đăng nhập bằng email/password
    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/nguoi-dung/login', {
                email,
                password
            });

            if (res.data.status) {
                localStorage.setItem('token', res.data.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;

                // Cập nhật trạng thái
                setCurrentUser(res.data.data.user);
                setIsAuthenticated(true);

                if (res.data.status) {
                    return {
                        ...res.data,
                        redirectReady: true
                    };
                }
            }

            return res.data;
        } catch (error) {
            throw new Error(
                error.res?.data?.message || 'Email hoặc mật khẩu không chính xác'
            );
        }
    };

    // Gửi OTP
    const sendOTP = async (email) => {
        try {
            const res = await axios.post('/api/auth/send-otp', { email });
            return res.data;
        } catch (error) {
            throw new Error(
                error.res?.data?.message || 'Không thể gửi OTP'
            );
        }
    };

    // Xác thực OTP
    const verifyOTP = async (email, otp) => {
        try {
            const res = await axios.post('/api/auth/verify-otp', {
                email,
                otp
            });

            if (res.data.success) {
                // Lưu token vào localStorage
                localStorage.setItem('token', res.data.token);

                // Thiết lập token trong header
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

                // Cập nhật trạng thái
                setCurrentUser(res.data.user);
                setIsAuthenticated(true);

                // Xử lý chuyển hướng từ server nếu có
                if (res.data.redirectTo) {
                    // Thêm thông tin về chuyển hướng vào res
                    return {
                        ...res.data,
                        redirectReady: true // Flag để biết có thể chuyển hướng
                    };
                }
            }

            return res.data;
        } catch (error) {
            throw new Error(
                error.res?.data?.message || 'OTP không hợp lệ'
            );
        }
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
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
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Không tìm thấy token');

            const res = await axios.put('/api/users/profile', userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                // Cập nhật thông tin người dùng trong context
                setCurrentUser({
                    ...currentUser,
                    ...res.data.user
                });
                return res.data;
            }

            return res.data;
        } catch (error) {
            throw new Error(
                error.res?.data?.message || 'Lỗi khi cập nhật thông tin'
            );
        }
    };

    // Làm mới thông tin người dùng từ server
    const refreshUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const res = await axios.post('/api/auth/me', { token });

            if (res.data.success) {
                setCurrentUser(res.data.user);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Lỗi khi làm mới thông tin người dùng:', error);
            return false;
        }
    };

    const contextValue = {
        currentUser,
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
        refreshUserInfo
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
