// src/routes/report.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const reportController = require('../controllers/reportController');

// GA-only route: Department summary report
router.get(
  '/department-summary',
  requireAuth,
  requireRole('GA'),
  reportController.departmentSummary
);

// GA-only route: System summary report
router.get(
  '/system-summary',
  requireAuth,
  requireRole('GA'),
  reportController.systemSummary
);

module.exports = router;