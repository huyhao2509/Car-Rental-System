import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/features/auth/RegisterForm';

const RegisterPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Nếu đã đăng nhập, chuyển hướng về trang chủ
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Helmet>
                <title>Đăng ký | Car Rental System</title>
            </Helmet>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">Car Rental System</h1>
                <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">Tạo tài khoản mới</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Hoặc{' '}
                    <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        đăng nhập nếu đã có tài khoản
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
