//controllers/loginController.js

const express = require('express');
const { User } = require('../models/index.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

async function login(req, res) {
  const { username, password } = req.body;
  console.log(username, password);
  try {
    const user = await User.findOne({ where: { userName: username } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    console.log(user.password);
    const isMatch = password === user.password ;
    //const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = tokenGenerator(user.role, user.username);
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function tokenGenerator(roleName, userName) {
  const payload = { roleName, userName };
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secretKey, options);
}

module.exports = { login };
