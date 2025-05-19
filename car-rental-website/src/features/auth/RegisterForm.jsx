import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { registerUser } from '@/services/authService';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setLoading(true);
            const res = await registerUser({
                hoTen: formData.fullName,
                email: formData.email,
                password: formData.password,
                soDienThoai: formData.phone
            });

            if (res.data.status) {
                toast.success(res.data.message);
                navigate('/login');
            } else {
                setError(res.data.message || 'Đăng ký không thành công');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký Tài Khoản</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="fullName">
                        Họ và tên
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập họ và tên"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập email"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập số điện thoại"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                        required
                        minLength={6}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="confirmPassword">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập lại mật khẩu"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            <span>Đang xử lý...</span>
                        </div>
                    ) : (
                        'Đăng ký'
                    )}
                </button>

                <div className="mt-4 text-center text-sm">
                    <p>
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
