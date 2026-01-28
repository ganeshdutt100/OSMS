// src/routes/department.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const requireAuth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// Create new request (only STAFF role)
router.post('/request', requireAuth, requireRole('STAFF'), departmentController.createRequest);

// List all requests for logged-in department user
router.get('/requests', requireAuth, requireRole('STAFF'), departmentController.listMyRequests);

// Get status of a specific request
router.get('/requests/:id', requireAuth, requireRole('STAFF'), departmentController.getRequestStatus);

module.exports = router;