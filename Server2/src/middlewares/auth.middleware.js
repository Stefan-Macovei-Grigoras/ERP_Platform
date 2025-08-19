// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']; // Expected: Bearer <token>
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Missing token' });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid or expired token' });

//     req.user = user; // Attach user to request
//     next();
//   });
// };

// // Example: requireRole('admin')
// const requireRole = (role) => {
//   return (req, res, next) => {
//     if (!req.user || req.user.roleName !== role) {
//       return res.status(403).json({ message: 'Forbidden: Insufficient role' });
//     }
//     next();
//   };
// };

// module.exports = { authenticateToken, requireRole };

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {

  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log('[AUTH MIDDLEWARE] Extracted token:', token ? 'TOKEN_FOUND' : 'NO_TOKEN');

  if (!token) {
    console.log('[AUTH MIDDLEWARE] No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('[AUTH MIDDLEWARE] Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('[ROLE MIDDLEWARE] No user found in request');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log('[ROLE MIDDLEWARE] Access denied - insufficient permissions');
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};