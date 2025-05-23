import React from 'react';
import { Navigate } from 'react-router-dom';
import PermissionGuard from '@/components/PermissionGuard';

/**
 * Component for protecting admin routes with specific permissions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.requiredPermissions - Array of permission IDs required to view the component
 * @param {React.ReactNode} props.children - Child components to render if user has permissions
 * @returns {React.ReactNode} - Either children or redirect based on permissions
 */
const AdminRoute = ({ requiredPermissions, children }) => {
  const fallback = <Navigate to="/admin" replace />;
  
  return (
    <PermissionGuard 
      requiredPermissions={requiredPermissions}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  );
};

export default AdminRoute;
