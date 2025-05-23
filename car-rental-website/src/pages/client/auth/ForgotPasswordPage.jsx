import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import Api from '@/utils/Api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }

        try {
            setLoading(true);
            const response = await Api.post('/nguoi-dung/forgot-password', { email });
            
            if (response.data.success) {
                setSuccess(true);
                toast.success('Mật khẩu mới đã được gửi tới email của bạn');
            } else {
                toast.error(response.data.message || 'Không thể đặt lại mật khẩu');
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Helmet>
                <title>Quên mật khẩu | Car Rental System</title>
            </Helmet>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">Car Rental System</h1>
                <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {success ? (
                        <div className="text-center">
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                                Mật khẩu mới đã được gửi tới email của bạn
                            </div>
                            <p className="mb-4">Vui lòng kiểm tra hộp thư của bạn và sử dụng mật khẩu mới để đăng nhập.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                            >
                                Quay lại trang đăng nhập
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-gray-600">
                                    Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi mật khẩu mới tới email của bạn.
                                </p>
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
                                    'Đặt lại mật khẩu'
                                )}
                            </button>

                            <div className="mt-4 text-center text-sm">
                                <p>
                                    <Link to="/login" className="text-blue-600 hover:underline">
                                        Quay lại trang đăng nhập
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage; 