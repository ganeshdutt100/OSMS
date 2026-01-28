// src/routes/admin.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const adminController = require('src/controllers/adminController');

// Users (ADMIN only)
router.get('/users', requireAuth, requireRole('ADMIN'), adminController.listUsers);
router.post('/users/delete', requireAuth, requireRole('ADMIN'), adminController.deleteUser);

// Departments (ADMIN only)
router.get('/departments', requireAuth, requireRole('ADMIN'), adminController.listDepartments);
router.post('/departments/delete', requireAuth, requireRole('ADMIN'), adminController.deleteDepartment);

module.exports = router;