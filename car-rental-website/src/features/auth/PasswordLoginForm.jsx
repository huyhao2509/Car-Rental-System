import React, { useState } from 'react';
import { Link, useNavigate, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

const PasswordLoginForm = ({ onSwitchToOTP }) => {
    let navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        if (!formData.email || !formData.password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            const res = await login(formData.email, formData.password);
            if (res.status) {
                toast.success(res.message);
                navigate('/');
            } else {
                setError(res.message || 'Đăng nhập không thành công');
            }
        } catch (error) {
            setError(error.message || 'Email hoặc mật khẩu không chính xác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập email của bạn"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu"
                        required
                    />
                    <div className="mt-1 text-right">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
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
                        'Đăng nhập'
                    )}
                </button>

                <div className="mt-4 text-center text-sm">
                    <p>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>

                {onSwitchToOTP && (
                    <>
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="px-3 text-gray-500 text-sm">HOẶC</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>

                        <button
                            type="button"
                            onClick={onSwitchToOTP}
                            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
                        >
                            Đăng nhập với OTP
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default PasswordLoginForm;
