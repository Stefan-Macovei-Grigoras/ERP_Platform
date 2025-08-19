// 📁 src/controllers/user.controller.js
const { User } = require('../models/index.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const logger = require('../utils/logger');

// // POST /login
// const login = async (req, res) => {
//   const { username, password } = req.body;
//   logger.log(`[LOGIN] Attempting login for user: ${username}`);

//   try {
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       logger.warn('[LOGIN] User not found');
//       return res.status(401).json({ message: 'User not found' });
//     }

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) {
//       logger.warn('[LOGIN] Invalid password');
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     const token = jwt.sign(
//       { id: user.id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     logger.log('[LOGIN] Login successful');
//     res.json({ token });
//   } catch (err) {
//     logger.error('[LOGIN] Error:', err);
//     res.status(500).json({ message: 'Error logging in' });
//   }
// };

// POST /users
const createUser = async (req, res) => {
  const { username, password, role } = req.body;
  logger.log(`[CREATE USER] Creating user: ${username}, role: ${role}`);

  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashed, role });

    logger.log('[CREATE USER] Success:', newUser.id);
    res.status(201).json(newUser);
  } catch (err) {
    logger.error('[CREATE USER] Error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// GET /users
const getUsers = async (req, res) => {
  logger.log('[GET USERS] Fetching user list...');

  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
    logger.log(`[GET USERS] Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    logger.error('[GET USERS] Error:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// PATCH /users/:id
// const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { username, password, role } = req.body;

//   try {
//     const user = await User.findByPk(id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     if (username) user.username = username;
//     //if (password) user.password = await bcrypt.hash(password, 10);
//     if(password) user.password = password
    
//     if (role) user.role = role;

//     await user.save();
//     res.json(user);
//   } catch (err) {
//     logger.error('[UPDATE USER ERROR]', err);
//     res.status(500).json({ message: 'Error updating user' });
//   }
// };

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10); // Hash the password
    if (role) user.role = role;

    await user.save();
    
    // Return user without password for security
    const { password: _, ...userResponse } = user.toJSON();
    res.json(userResponse);
  } catch (err) {
    logger.error('[UPDATE USER ERROR]', err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  // Extract the user ID from the request parameters
  const { id } = req.params;
  logger.log(`[DELETE USER] Attempting to delete user with ID: ${id}`);

  try {
    // Attempt to delete the user from the database
    // User.destroy returns the number of rows affected (deleted)
    const rowsDeleted = await User.destroy({
      where: { id: id } // Specify the condition for deletion
    });

    // Check if any row was actually deleted
    if (rowsDeleted === 0) {
      logger.log(`[DELETE USER] User with ID: ${id} not found.`);
      // If no rows were deleted, the user didn't exist
      return res.status(404).json({ message: 'User not found' });
    }

    logger.log(`[DELETE USER] Successfully deleted user with ID: ${id}.`);
    // Send a 204 No Content status for successful deletion
    res.sendStatus(204);

  } catch (err) {
    logger.error(`[DELETE USER] Error deleting user with ID: ${id}:`, err);
    // Send a 500 Internal Server Error for other issues
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  // login,
  createUser,
  getUsers,
  updateUser, 
  deleteUser 
};
