import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
    const { sendOTP, verifyOTP, login } = useAuth();
    const [activeTab, setActiveTab] = useState('password'); // 'password' hoặc 'otp'
    let navigate = useNavigate(); // Hook để điều hướng
    // State cho đăng nhập bằng email/password
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State cho đăng nhập OTP
    const [emailOTP, setEmailOTP] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Xử lý đăng nhập bằng email/password
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            setLoading(true);
            const response = await login(formData.email, formData.password);
            console.log(response);
            if (response.status) {
                toast.success(response.message);
                onClose();
            } else {
                setError(response.message || 'Đăng nhập không thành công');
            }
        } catch (error) {
            setError(error.message || 'Email hoặc mật khẩu không chính xác');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi các trường form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Xử lý gửi OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await sendOTP(emailOTP);

            if (response.success) {
                setMessage('Đã gửi OTP thành công! Vui lòng kiểm tra email của bạn.');
                setStep(2);
            } else {
                setError(response.message || 'Không thể gửi OTP');
            }
        } catch (error) {
            setError(error.message || 'Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý xác thực OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await verifyOTP(emailOTP, otp);

            if (response.success) {
                toast.success('Đăng nhập thành công!');
                onClose(); // Đóng modal khi đăng nhập thành công
            } else {
                setError(response.message || 'OTP không hợp lệ');
            }
        } catch (error) {
            setError(error.message || 'Không thể xác thực OTP');
        } finally {
            setLoading(false);
        }
    };

    // Reset form OTP về bước đầu tiên
    const handleReset = () => {
        setStep(1);
        setOtp('');
        setMessage('');
        setError('');
    };

    // Xử lý chuyển tab
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setMessage('');
        if (tab === 'otp') {
            setStep(1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Đăng nhập
                </h2>

                {/* Tab Navigation */}
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 font-medium text-sm flex-1 text-center ${activeTab === 'password'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabChange('password')}
                    >
                        Đăng nhập bằng mật khẩu
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm flex-1 text-center ${activeTab === 'otp'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabChange('otp')}
                    >
                        Đăng nhập bằng OTP
                    </button>
                </div>

                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {activeTab === 'password' ? (
                    <form onSubmit={handlePasswordLogin}>
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
                                <a href="#" className="text-blue-600 text-sm hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="mt-4 text-center text-sm">
                            <p>
                                Chưa có tài khoản?{' '}
                                <a href="/register" className="text-blue-600 hover:underline">
                                    Đăng ký
                                </a>
                            </p>
                        </div>
                    </form>
                ) : (
                    step === 1 ? (
                        <form onSubmit={handleSendOTP}>
                            <div className="mb-4">
                                <label htmlFor="emailOTP" className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="emailOTP"
                                    value={emailOTP}
                                    onChange={(e) => setEmailOTP(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi OTP'}
                            </button>

                            <div className="mt-4 text-center text-sm">
                                <p>
                                    Chưa có tài khoản?{' '}
                                    <a href="/register" className="text-blue-600 hover:underline">
                                        Đăng ký
                                    </a>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP}>
                            <div className="mb-4">
                                <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">
                                    Mã OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mã OTP từ email"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="w-1/3 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
                                >
                                    Quay lại
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-2/3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
                                </button>
                            </div>
                        </form>
                    )
                )}
            </div>
        </div>
    );
};

export default LoginModal;
