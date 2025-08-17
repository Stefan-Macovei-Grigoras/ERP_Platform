//controllers/loginController.js
//controllers/loginController.js
//controllers/loginController.js

//controllers/loginController.js

const express = require('express');
const { User } = require('../models/index.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

async function login(req, res) {
  const { username, password } = req.body;
  logger.log(username, password);
  
  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    logger.log(user.password);
    const isMatch = password === user.password;
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = tokenGenerator(user.role, user.username, user.id);
    
    res.json({ 
      token, 
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      message: 'Login successful' 
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function tokenGenerator(role, username, id) {
  const payload = { 
    role, 
    username, 
    id 
  };
  const options = { expiresIn: '24h' };
  
  return jwt.sign(payload, secretKey, options);
}

// const verifyToken = async (req, res) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     console.log(token);
    
//     if (!token) {
//       return res.status(401).json({ valid: false, message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, secretKey);
//     const user = await User.findByPk(decoded.id); // Changed from decoded.userId to decoded.id
    
//     if (!user) {
//       return res.status(401).json({ valid: false, message: 'User not found' });
//     }

//     res.json({ 
//       valid: true, 
//       user: {
//         id: user.id,
//         username: user.username,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(401).json({ valid: false, message: 'Invalid token' });
//   }
// };
const verifyToken = async (req, res) => {
  try {
    // Debug logging
    console.log('All headers:', req.headers);
    console.log('Authorization header:', req.headers['authorization']);
    console.log('Authorization header (lowercase):', req.headers.authorization);
    
    const authHeader = req.headers['authorization'] || req.headers.Authorization;
    console.log('Auth header found:', authHeader);
    
    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Extracted token:', token);
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded payload:', decoded);
    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ valid: false, message: 'User not found' });
    }

    res.json({ 
      valid: true, 
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.log('Error in verifyToken:', error);
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
};

module.exports = { login, verifyToken };