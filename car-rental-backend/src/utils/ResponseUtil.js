/**
 * Utility class for standardized API responses
 */
class ResponseUtil {
    /**
     * Success response format
     * @param {Object} res - Express response object
     * @param {*} data - Response data
     * @param {string} message - Success message
     * @param {number} statusCode - HTTP status code
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            status: true,
            message: message,
            data: data,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Error response format
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {*} error - Error details (only in development)
     */
    static error(res, message = 'Internal Server Error', statusCode = 500, error = null) {
        const response = {
            status: false,
            message: message,
            timestamp: new Date().toISOString(),
        };

        // Only include error details in development
        if (process.env.NODE_ENV === 'development' && error) {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Validation error response
     * @param {Object} res - Express response object
     * @param {Array} errors - Array of validation errors
     */
    static validationError(res, errors) {
        return res.status(400).json({
            status: false,
            message: 'Validation Error',
            errors: errors,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Paginated response format
     * @param {Object} res - Express response object
     * @param {Array} items - Data items
     * @param {Object} pagination - Pagination info
     * @param {string} message - Success message
     */
    static paginated(res, items, pagination, message = 'Success') {
        return res.status(200).json({
            status: true,
            message: message,
            data: {
                items: items,
                pagination: {
                    page: parseInt(pagination.page),
                    limit: parseInt(pagination.limit),
                    totalItems: pagination.totalItems,
                    totalPages: Math.ceil(pagination.totalItems / pagination.limit),
                    hasNext: pagination.page < Math.ceil(pagination.totalItems / pagination.limit),
                    hasPrev: pagination.page > 1,
                },
            },
            timestamp: new Date().toISOString(),
        });
    }
}

module.exports = ResponseUtil;
