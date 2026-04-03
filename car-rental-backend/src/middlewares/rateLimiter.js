const rateLimit = require('express-rate-limit');
const ResponseUtil = require('../utils/ResponseUtil');

/**
 * Custom rate limit handler
 */
const rateLimitHandler = (req, res) => {
    return ResponseUtil.error(res, 'Quá nhiều requests từ IP này, vui lòng thử lại sau', 429);
};

/**
 * General API rate limiter
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: false,
        message: 'Quá nhiều requests, vui lòng thử lại sau 15 phút',
    },
    handler: rateLimitHandler,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Authentication rate limiter (stricter)
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        status: false,
        message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút',
    },
    handler: rateLimitHandler,
    skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * File upload rate limiter
 */
const uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 uploads per minute
    message: {
        status: false,
        message: 'Quá nhiều uploads, vui lòng thử lại sau 1 phút',
    },
    handler: rateLimitHandler,
});

/**
 * OTP rate limiter
 */
const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 OTP requests per minute
    message: {
        status: false,
        message: 'Quá nhiều requests OTP, vui lòng thử lại sau 1 phút',
    },
    handler: rateLimitHandler,
});

/**
 * Search rate limiter (for expensive search operations)
 */
const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 searches per minute
    message: {
        status: false,
        message: 'Quá nhiều tìm kiếm, vui lòng thử lại sau',
    },
    handler: rateLimitHandler,
});

module.exports = {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    otpLimiter,
    searchLimiter,
};
