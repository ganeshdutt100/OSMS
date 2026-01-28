// src/routes/ga.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const gaController = require('../controllers/gaController');

// Requests
router.get('/requests', requireAuth, requireRole('GA'), gaController.listRequests);
router.post('/requests/:id/approve', requireAuth, requireRole('GA'), gaController.approveRequest);
router.post('/requests/:id/reject', requireAuth, requireRole('GA'), gaController.rejectRequest);

// Stock
router.get('/stock', requireAuth, requireRole('GA'), gaController.listStock);
router.post('/stock', requireAuth, requireRole('GA'), gaController.addStockItem);
router.put('/stock/:id', requireAuth, requireRole('GA'), gaController.updateStockItem);

// Issues
router.get('/issues', requireAuth, requireRole('GA'), gaController.listIssues);
router.post('/issues', requireAuth, requireRole('GA'), gaController.createIssue);

// Reports
router.get('/reports', requireAuth, requireRole('GA'), gaController.generateReports);

module.exports = router;