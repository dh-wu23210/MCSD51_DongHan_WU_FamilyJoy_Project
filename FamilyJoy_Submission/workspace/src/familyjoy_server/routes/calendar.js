/** Module: calendar. Handles calendar responsibilities. */

const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Parent + Child routes
router.get('/calendar', requireRole(['parent', 'child']), calendarController.getCalendar);

module.exports = router;
