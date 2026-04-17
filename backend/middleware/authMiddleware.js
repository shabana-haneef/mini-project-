const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    // Check for cookie first, then header
    token = req.cookies.jwt;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error('Auth Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const superadmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a super admin' });
    }
};

const coordinator = (req, res, next) => {
    if (req.user && (req.user.role === 'coordinator' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a coordinator' });
    }
};

const mentor = (req, res, next) => {
    if (req.user && (req.user.role === 'mentor' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a mentor' });
    }
};

const club = (req, res, next) => {
    if (req.user && (req.user.role === 'club' || req.user.role === 'coordinator' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a club role' });
    }
};

const restrictSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        return res.status(403).json({ message: 'Super Admin is natively restricted to governance monitoring strictly out of payload operations.' });
    }
    next();
};

module.exports = { protect, admin, superadmin, restrictSuperAdmin, coordinator, mentor, club };
