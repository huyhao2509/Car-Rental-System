// src/utils/logger.js
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.File({ filename: 'error.log' }),
        new transports.Console(),
    ],
});

export default logger;
