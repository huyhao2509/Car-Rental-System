import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PermissionService from '@/services/PermissionService';

/**
 * Custom hook for checking user permissions
 * @returns {Object} - Permission checking functions and loading state
 */
export const usePermission = () => {
  const { currentUser } = useAuth();
  const [permissionCache, setPermissionCache] = useState({});
  const [loading, setLoading] = useState(false);
  
  /**
   * Check if the current user has specific permissions
   * @param {Array} requiredPermissions - Array of permission IDs to check
   * @returns {Promise<boolean>} - Whether the user has the required permissions
   */
  const hasPermission = useCallback(async (requiredPermissions) => {
    if (!currentUser) return false;
    
    // Create a cache key from the permission IDs
    const cacheKey = requiredPermissions.sort().join(',');
    
    // If we already checked these permissions, return from cache
    if (permissionCache[cacheKey] !== undefined) {
      return permissionCache[cacheKey];
    }
    
    setLoading(true);
    try {
      const response = await PermissionService.checkUserPermissions(
        currentUser.id,
        requiredPermissions
      );
      
      // Cache the result
      setPermissionCache(prev => ({
        ...prev,
        [cacheKey]: response.hasPermission
      }));
      
      return response.hasPermission;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, permissionCache]);
  
  /**
   * Clear the permission cache when the user changes
   */
  useEffect(() => {
    setPermissionCache({});
  }, [currentUser]);
  
  return { hasPermission, loading };
};

export default usePermission;
