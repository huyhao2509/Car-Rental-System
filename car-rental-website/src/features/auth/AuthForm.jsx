import { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/send-otp', { email });

            if (response.data.success) {
                setStep(2); // Chuyển sang bước nhập OTP
            } else {
                setError(response.data.message || 'Có lỗi xảy ra khi gửi OTP');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Không thể kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/verify-otp', { email, otp });

            if (response.data.success) {
                // Lưu thông tin người dùng vào localStorage hoặc context
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Chuyển hướng đến trang chủ hoặc dashboard
                window.location.href = '/';
            } else {
                setError(response.data.message || 'OTP không hợp lệ');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Không thể xác thực OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập </h2>

            {step === 1 ? (
                <form onSubmit={handleSendOTP}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOTP}>
                    <div className="form-group">
                        <label htmlFor="otp">Nhập mã OTP đã gửi đến {email}</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang xác thực...' : 'Xác nhận'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="back-button"
                    >
                        Quay lại
                    </button>
                </form>
            )}
        </div>
    );
};

export default AuthForm; 
