const ResponseUtil = require('../utils/ResponseUtil');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const globalErrorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Global Error Handler:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Default error
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return ResponseUtil.validationError(res, errors);
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Data already exists';
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Invalid reference data';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Multer errors (file upload)
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413;
        message = 'File too large';
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        statusCode = 400;
        message = 'Unexpected file field';
    }

    // Custom API errors
    if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    return ResponseUtil.error(res, message, statusCode, err.message);
};

/**
 * Handle async errors
 * @param {Function} fn - Async function
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Handle 404 errors
 */
const notFoundHandler = (req, res, next) => {
    return ResponseUtil.error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
    globalErrorHandler,
    asyncHandler,
    notFoundHandler
}; 
