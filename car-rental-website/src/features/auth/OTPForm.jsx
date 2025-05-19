import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

const OTPForm = ({ onSwitchToPassword }) => {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  
  const [step, setStep] = useState('email'); // 'email' hoặc 'verify'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State cho OTP
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  // Chuẩn bị refs cho các input OTP
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Bắt đầu đếm ngược khi bước verify được kích hoạt
  useEffect(() => {
    if (step === 'verify' && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
      };
    }
  }, [step, countdown]);
  
  // Xử lý gửi email để nhận OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Vui lòng nhập email của bạn');
      return;
    }
    
    try {
      setLoading(true);
      const response = await sendOTP(email);
      
      if (response.success) {
        setStep('verify');
        setCountdown(300); // 5 phút
        toast.success('Mã OTP đã được gửi đến email của bạn!');
      } else {
        setError(response.message || 'Không thể gửi mã OTP');
      }
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi gửi OTP');
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý nhập OTP theo từng ô
  const handleOtpChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;
    
    // Cập nhật state
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Cập nhật giá trị OTP vào form
    setValue('otp', newOtpValues.join(''));
    
    // Tự động focus vào ô tiếp theo nếu có giá trị
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Xử lý phím backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Xử lý khi paste OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Kiểm tra xem dữ liệu dán có phải là số 6 chữ số không
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpValues = pastedData.split('');
      setOtpValues(newOtpValues);
      setValue('otp', pastedData);
      
      // Focus vào ô cuối cùng
      inputRefs.current[5].focus();
    }
  };
  
  // Xử lý OTP submit
  const onSubmit = async (data) => {
    setError('');
    
    // Nếu OTP chưa đủ 6 chữ số, hiển thị thông báo lỗi
    if (data.otp.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
      return;
    }
    
    try {
      setVerifyLoading(true);
      const response = await verifyOTP(email, data.otp);
      
      if (response.success) {
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        setError(response.message || 'Mã OTP không chính xác');
      }
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi xác thực OTP');
    } finally {
      setVerifyLoading(false);
    }
  };
  
  // Xử lý gửi lại OTP
  const handleResendOTP = async () => {
    if (countdown > 0 || loading) return;
    
    try {
      setLoading(true);
      const response = await sendOTP(email);
      
      if (response.success) {
        setCountdown(300); // Reset thời gian đếm ngược
        toast.success('Mã OTP mới đã được gửi!');
      } else {
        setError(response.message || 'Không thể gửi lại mã OTP');
      }
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi gửi lại OTP');
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
      
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Đang gửi...</span>
              </div>
            ) : (
              'Gửi mã OTP'
            )}
          </button>
          
          {onSwitchToPassword && (
            <>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-3 text-gray-500 text-sm">HOẶC</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              
              <button
                type="button"
                onClick={onSwitchToPassword}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                Đăng nhập với mật khẩu
              </button>
            </>
          )}
        </form>
      ) : (
        <div>
          <p className="text-gray-600 text-center mb-6">
            Nhập mã xác thực 6 chữ số đã được gửi đến <br />
            <span className="font-semibold">{email}</span>
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Hidden input to store the complete OTP value */}
            <input type="hidden" {...register('otp', { required: true })} />
            
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otpValues[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>
            
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Thời gian còn lại: <span className="font-medium">{formatTime(countdown)}</span>
              </p>
              <button
                type="button"
                className={`text-blue-600 text-sm hover:underline focus:outline-none ${
                  countdown > 0 || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
              >
                Gửi lại mã
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-1/3 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                Quay lại
              </button>
              
              <button
                type="submit"
                disabled={verifyLoading}
                className="w-2/3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {verifyLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    <span>Đang xác thực...</span>
                  </div>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OTPForm;
