const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization;
        // console.log("token", token)
        if (!token) {
            return res.status(401).json({ error: 'Access denied. Token is missing' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: 'Access denied. Invalid token' });
        }

        // Check if user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'Access denied. User not found' });
        }

        // Attach user data to request object for further use
        req.user = user;
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error('Error authenticating token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateToken;
