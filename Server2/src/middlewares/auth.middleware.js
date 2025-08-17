// // middlewares/auth.middleware.js
// const jwt = require('jsonwebtoken');
// const { User } = require('../models/index.model');
// require('dotenv').config();

// const secretKey = process.env.JWT_SECRET;

// const authenticateToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token required' });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     const user = await User.findByPk(decoded.userId);
    
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };

// const requireRole = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ 
//         message: 'Access denied. Insufficient permissions.',
//         userRole: req.user.role,
//         requiredRoles: allowedRoles
//       });
//     }

//     next();
//   };
// };

// module.exports = { authenticateToken, requireRole };

// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/index.model');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.path} - Authentication attempt`);
  console.log(`[AUTH] Headers received:`, req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log(`[AUTH] Authorization header:`, authHeader);
  
  const token = authHeader && authHeader.replace('Bearer ', '').trim();
  console.log(`[AUTH] Extracted token:`, token ? `${token.substring(0, 20)}...` : 'No token');

  if (!token) {
    console.log(`[AUTH] FAILED - No token provided`);
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(`[AUTH] Token decoded successfully:`, decoded);
    
    const user = await User.findByPk(decoded.id); // Changed from decoded.userId to decoded.id
    console.log(`[AUTH] User lookup result:`, user ? `User found: ${user.username} (${user.role})` : 'User not found');
    
    if (!user) {
      console.log(`[AUTH] FAILED - Invalid token, user not found`);
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    console.log(`[AUTH] SUCCESS - User authenticated: ${user.username} with role: ${user.role}`);
    next();
  } catch (error) {
    console.log(`[AUTH] FAILED - Token verification error:`, error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(`[ROLE] Checking role authorization for: ${req.method} ${req.path}`);
    console.log(`[ROLE] Required roles:`, allowedRoles);
    console.log(`[ROLE] User role:`, req.user?.role || 'No user');
    
    if (!req.user) {
      console.log(`[ROLE] FAILED - No authenticated user found`);
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log(`[ROLE] FAILED - Access denied. User role '${req.user.role}' not in allowed roles:`, allowedRoles);
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        userRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }

    console.log(`[ROLE] SUCCESS - Role '${req.user.role}' authorized for this endpoint`);
    next();
  };
};

module.exports = { authenticateToken, requireRole };