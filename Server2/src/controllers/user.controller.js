// 📁 src/controllers/user.controller.js
const { User } = require('../models/index.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// POST /login
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`[LOGIN] Attempting login for user: ${username}`);

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.warn('[LOGIN] User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.warn('[LOGIN] Invalid password');
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('[LOGIN] Login successful');
    res.json({ token });
  } catch (err) {
    console.error('[LOGIN] Error:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// POST /users
const createUser = async (req, res) => {
  const { username, password, role } = req.body;
  console.log(`[CREATE USER] Creating user: ${username}, role: ${role}`);

  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashed, role });

    console.log('[CREATE USER] Success:', newUser.id);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('[CREATE USER] Error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// GET /users
const getUsers = async (req, res) => {
  console.log('[GET USERS] Fetching user list...');

  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
    console.log(`[GET USERS] Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('[GET USERS] Error:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// PATCH /users/:id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('[UPDATE USER ERROR]', err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

module.exports = {
  login,
  createUser,
  getUsers,
  updateUser,   
};
