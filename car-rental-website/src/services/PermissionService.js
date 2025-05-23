import Api from '@/utils/Api';

/**
 * Service for handling permissions-related API calls
 */
class PermissionService {
  /**
   * Get all permissions for a specific role
   * @param {number} roleId - The ID of the role
   * @returns {Promise} - Promise containing the permissions data
   */
  static async getPermissionsByRole(roleId) {
    try {
      const response = await Api.get(`/admin/chuc-vu/get-permissions-by-role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions by role:', error);
      throw error;
    }
  }

  /**
   * Update permissions for a specific role
   * @param {number} roleId - The ID of the role
   * @param {Array} permissions - Array of permission IDs to assign to the role
   * @returns {Promise} - Promise containing the response data
   */
  static async updatePermissions(roleId, permissions) {
    try {
      const response = await Api.post('/admin/chuc-vu/update-permissions', {
        idChucVu: roleId,
        permissions: permissions
      });
      return response.data;
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  }

  /**
   * Check if a user has specific permissions
   * @param {number} userId - The ID of the user
   * @param {Array} requiredPermissions - Array of required permission IDs
   * @returns {Promise} - Promise containing the check result
   */
  static async checkUserPermissions(userId, requiredPermissions) {
    try {
      const response = await Api.post(`/admin/chuc-vu/check-user-permissions/${userId}`, {
        required: requiredPermissions
      });
      return response.data;
    } catch (error) {
      console.error('Error checking user permissions:', error);
      throw error;
    }
  }
}

export default PermissionService;
