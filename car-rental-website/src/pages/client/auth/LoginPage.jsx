import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import OTPForm from '@/features/auth/OTPForm';
import PasswordLoginForm from '@/features/auth/PasswordLoginForm';

const LoginPage = () => {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' hoặc 'otp'
    const [otpStep, setOtpStep] = useState('email'); // 'email' hoặc 'otp'
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const { isAuthenticated, sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleEmailSubmit = async (submittedEmail) => {
        setLoading(true);
        try {
            const response = await sendOTP(submittedEmail);
            if (response.success) {
                setEmail(submittedEmail);
                setOtpStep('otp');
                toast.success('Mã OTP đã được gửi đến email của bạn!');
            } else {
                toast.error(response.message || 'Không thể gửi mã OTP');
            }
        } catch (error) {
            toast.error(error.message || 'Đã xảy ra lỗi khi gửi mã OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (otp) => {
        setVerifyLoading(true);
        try {
            const response = await verifyOTP(email, otp);
            if (response.success) {
                toast.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                toast.error(response.message || 'Xác minh OTP thất bại');
            }
        } catch (error) {
            toast.error(error.message || 'Đã xảy ra lỗi khi xác minh OTP');
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Helmet>
                <title>Đăng nhập | Car Rental System</title>
            </Helmet>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">Car Rental System</h1>
                <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
                    {loginMethod === 'password' ? 'Đăng nhập tài khoản' : 'Đăng nhập với OTP'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Tab navigation */}
                    <div className="flex border-b mb-6">
                        <button
                            className={`px-4 py-2 font-medium text-sm flex-1 text-center ${loginMethod === 'password'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setLoginMethod('password')}
                        >
                            Đăng nhập với mật khẩu
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm flex-1 text-center ${loginMethod === 'otp'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => {
                                setLoginMethod('otp');
                                setOtpStep('email');
                            }}
                        >
                            Đăng nhập với OTP
                        </button>
                    </div>

                    {loginMethod === 'password' ? (
                        <PasswordLoginForm onSwitchToOTP={() => {
                            setLoginMethod('otp');
                            setOtpStep('email');
                        }} />
                    ) : (
                        <>
                            {otpStep === 'email' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Nhập email của bạn"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        handleEmailSubmit(e.target.value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => {
                                                const emailInput = document.getElementById('email');
                                                if (emailInput && emailInput.value.trim()) {
                                                    handleEmailSubmit(emailInput.value);
                                                } else {
                                                    toast.error('Vui lòng nhập email');
                                                }
                                            }}
                                            disabled={loading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {loading ? 'Đang gửi...' : 'Tiếp tục'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <OTPForm
                                    onSwitchToPassword={() => setLoginMethod('password')}
                                    onOTPSubmit={handleOTPSubmit}
                                    loading={verifyLoading}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
