// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Change password
router.post('/change-password', authController.changePassword);

// Delete user (ADMIN only in future, but currently open)
router.post('/delete', authController.deleteUser);

module.exports = router;