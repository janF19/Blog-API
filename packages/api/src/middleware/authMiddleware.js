import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility function to hash password (preserved from your original implementation)
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Authentication via JWT
export const authenticateUser = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token (expecting "Bearer TOKEN")
    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Optional: Keep your password comparison method
export const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Middleware to authorize admin (kept from your original implementation)
export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only' });
};