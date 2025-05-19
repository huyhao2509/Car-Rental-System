import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error("Token không hợp lệ");
    }
};
