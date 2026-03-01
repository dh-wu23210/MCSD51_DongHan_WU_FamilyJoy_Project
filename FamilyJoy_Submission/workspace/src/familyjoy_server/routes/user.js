/** Module: user. Handles user responsibilities. */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Parent + Child routes
router.get('/profile', requireRole(['parent', 'child']), userController.getProfile);
router.post('/profile/update-nickname', requireRole(['parent', 'child']), userController.postUpdateNickname);
router.post('/profile/update-username', requireRole(['parent', 'child']), userController.postUpdateUsername);
router.get('/profile/change-password', requireRole(['parent', 'child']), userController.getChangePassword);
router.post('/profile/change-password', requireRole(['parent', 'child']), userController.postChangePassword);

module.exports = router;
