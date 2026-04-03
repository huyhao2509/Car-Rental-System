const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    },
});

// Avoid crashing the whole app when Redis is unavailable.
// We still log the error, but let the Express server keep running.
redisClient.on('error', (err) => {
    console.error('Redis client error:', err?.message || err);
});

const connectRedis = async () => {
    try {
        // In newer versions of redis client, connect() is required
        await redisClient.connect();
        console.log('Redis connection has been established successfully.');
        return true;
    } catch (error) {
        console.error('Unable to connect to Redis:', error);
        return false;
    }
};

// Add promisify methods
redisClient.getAsync = (key) => redisClient.get(key);

// Enhanced set method with optional expiration
redisClient.setAsync = async (key, value, expireTime = null) => {
    await redisClient.set(key, value);

    // Set expiration if provided
    if (expireTime !== null) {
        await redisClient.expire(key, expireTime);
    }

    return true;
};

// Set with expiration in seconds
redisClient.setExAsync = (key, value, seconds) => {
    return redisClient.setAsync(key, value, seconds);
};

redisClient.delAsync = (key) => redisClient.del(key);
redisClient.expireAsync = (key, seconds) => redisClient.expire(key, seconds);
redisClient.ttlAsync = (key) => redisClient.ttl(key);

module.exports = { connectRedis, redisClient };
