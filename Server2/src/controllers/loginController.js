// const jwt = require('jsonwebtoken');
// const { User } = require('../models/index.model');
// const logger = require('../utils/logger');

// const JWT_SECRET = process.env.JWT_SECRET;

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required' });
//     }
    
//     // Find user in database
//     const user = await User.findOne({ where: { username, password } });
    
//     if (user) {
//       logger.log(`[LOGIN] User details - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
//     }
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
    
//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, username: user.username, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Return token and user data
//     const response = {
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         role: user.role
//       }
//     };
    
//     logger.log(`[LOGIN] Login successful for user: ${user.username}`);
//     res.json(response);

//   } catch (error) {
//     logger.error('[LOGIN] Error occurred:', error);
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// const verifyToken = async (req, res) => {
//   logger.log('[VERIFY TOKEN] Token verification started');
  
//   try {
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     logger.log(`[VERIFY TOKEN] Token received: ${token ? 'YES' : 'NO'}`);

//     if (!token) {
//       logger.log('[VERIFY TOKEN] No token provided');
//       return res.status(401).json({ valid: false, message: 'No token provided' });
//     }

//     logger.log('[VERIFY TOKEN] Verifying JWT token...');
//     const decoded = jwt.verify(token, JWT_SECRET);
//     logger.log(`[VERIFY TOKEN] Token decoded successfully. User ID: ${decoded.id}, Username: ${decoded.username}`);

//     logger.log(`[VERIFY TOKEN] Looking up user in database with ID: ${decoded.id}`);
//     const user = await User.findByPk(decoded.id);
//     logger.log(`[VERIFY TOKEN] Database lookup completed. User found: ${user ? 'YES' : 'NO'}`);

//     if (!user) {
//       logger.log('[VERIFY TOKEN] User not found in database');
//       return res.status(401).json({ valid: false, message: 'User not found' });
//     }

//     logger.log(`[VERIFY TOKEN] User verification successful - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    
//     res.json({
//       valid: true,
//       user: {
//         id: user.id,
//         username: user.username,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     logger.error('[VERIFY TOKEN] Error occurred:', error);
//     console.error('Token verification error:', error);
//     res.status(401).json({ valid: false, message: 'Invalid token' });
//   }
// };

// module.exports = {
//   login,
//   verifyToken
// };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/index.model');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find user by username only
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      logger.log('[LOGIN] User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      logger.log('[LOGIN] Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    logger.log(`[LOGIN] User details - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and user data
    const response = {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
    
    logger.log(`[LOGIN] Login successful for user: ${user.username}`);
    res.json(response);

  } catch (error) {
    logger.error('[LOGIN] Error occurred:', error);
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyToken = async (req, res) => {
  logger.log('[VERIFY TOKEN] Token verification started');
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    logger.log(`[VERIFY TOKEN] Token received: ${token ? 'YES' : 'NO'}`);

    if (!token) {
      logger.log('[VERIFY TOKEN] No token provided');
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    logger.log('[VERIFY TOKEN] Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.log(`[VERIFY TOKEN] Token decoded successfully. User ID: ${decoded.id}, Username: ${decoded.username}`);

    logger.log(`[VERIFY TOKEN] Looking up user in database with ID: ${decoded.id}`);
    const user = await User.findByPk(decoded.id);
    logger.log(`[VERIFY TOKEN] Database lookup completed. User found: ${user ? 'YES' : 'NO'}`);

    if (!user) {
      logger.log('[VERIFY TOKEN] User not found in database');
      return res.status(401).json({ valid: false, message: 'User not found' });
    }

    logger.log(`[VERIFY TOKEN] User verification successful - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    
    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    logger.error('[VERIFY TOKEN] Error occurred:', error);
    console.error('Token verification error:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
};

module.exports = {
  login,
  verifyToken
};
