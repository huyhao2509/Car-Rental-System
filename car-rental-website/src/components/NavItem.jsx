import React from 'react';
import { NavLink } from 'react-router-dom';
import PermissionGuard from './PermissionGuard';

/**
 * Navigation item component with permission check
 * 
 * @param {Object} props - Component props
 * @param {string} props.to - Route path
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.label - Label text
 * @param {Array} props.requiredPermissions - Array of permission IDs required to see this nav item
 * @returns {React.ReactNode} - Nav link or null based on permissions
 */
const NavItem = ({ to, icon, label, requiredPermissions }) => {
  const navItem = (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sm transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500 font-medium'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <span className="inline-block mr-2">{icon}</span>
      {label}
    </NavLink>
  );
  
  // If no permissions are required, always show the nav item
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return navItem;
  }
  
  // Otherwise, only show if the user has the required permissions
  return (
    <PermissionGuard
      requiredPermissions={requiredPermissions}
      fallback={null}
    >
      {navItem}
    </PermissionGuard>
  );
};

export default NavItem;
