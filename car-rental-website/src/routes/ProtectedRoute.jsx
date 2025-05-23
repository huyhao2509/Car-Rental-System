import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PermissionService from '@/services/PermissionService';

// Route yêu cầu đăng nhập
const ProtectedRoute = () => {
    const { isAuthenticated, currentUser, loading } = useAuth();
    const location = useLocation();
    const [hasAccess, setHasAccess] = useState(null);
    const [loadingPermission, setLoadingPermission] = useState(false);

    // Check user permissions for admin routes
    useEffect(() => {
        const checkAdminAccess = async () => {
            // No need to check permissions if not trying to access admin area
            if (!location.pathname.startsWith('/admin')) {
                setHasAccess(true);
                return;
            }

            // Default admin access check
            if (!currentUser || currentUser.ChucVu.id === 2) {
                setHasAccess(false);
                return;
            }

            setLoadingPermission(true);
            try {
                // Check specific section access based on path
                // Here you can implement specific permission checks for different admin sections
                // For now, we're just allowing access to any staff role (non-customer)
                setHasAccess(true);
            } catch (error) {
                console.error('Error checking permissions:', error);
                setHasAccess(false);
            } finally {
                setLoadingPermission(false);
            }
        };

        if (isAuthenticated && !loading && currentUser) {
            checkAdminAccess();
        }
    }, [isAuthenticated, currentUser, loading, location.pathname]);

    // Show loading spinner while checking authentication or permissions
    if (loading || (isAuthenticated && loadingPermission)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to home if trying to access admin area without permission
    if (location.pathname.startsWith('/admin') && hasAccess === false) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
