import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Route yêu cầu đăng nhập
const ProtectedRoute = () => {
    const { isAuthenticated, currentUser, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">loading</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (location.pathname.startsWith('/admin') && (!currentUser || currentUser.ChucVu.id !== 1)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
