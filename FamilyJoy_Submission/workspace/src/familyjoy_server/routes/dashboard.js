/** Module: dashboard. Handles dashboard responsibilities. */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Parent + Child dashboard (role-based rendering in controller)
router.get('/dashboard', requireRole(['parent', 'child']), dashboardController.getDashboard);
router.get('/backpack', requireRole(['child']), dashboardController.getChildBackpack);

module.exports = router;
