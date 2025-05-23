import React, { useState, useEffect } from 'react';
import usePermission from '@/hooks/usePermission';

/**
 * Component that conditionally renders children based on user permissions
 * 
 * @param {Object} props - Component props
 * @param {Array} props.requiredPermissions - Array of permission IDs required to view the children
 * @param {React.ReactNode} props.children - Child components to render if user has permissions
 * @param {React.ReactNode} props.fallback - Component to render if user doesn't have permissions
 * @returns {React.ReactNode} - Either children or fallback based on permissions
 */
const PermissionGuard = ({ requiredPermissions, children, fallback = null }) => {
  const { hasPermission, loading } = usePermission();
  const [canAccess, setCanAccess] = useState(false);
  
  useEffect(() => {
    const checkPermission = async () => {
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAccess = await hasPermission(requiredPermissions);
        setCanAccess(hasAccess);
      } else {
        // If no permissions required, allow access
        setCanAccess(true);
      }
    };
    
    checkPermission();
  }, [requiredPermissions, hasPermission]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return canAccess ? children : fallback;
};

export default PermissionGuard;
