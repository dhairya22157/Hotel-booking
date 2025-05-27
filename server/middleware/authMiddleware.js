import User from '../models/User.js';

// middleware to check if the user is authenticated
export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, no userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
};