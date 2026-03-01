/** Module: family. Handles family responsibilities. */

const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { requireAuth, requirePasswordChange, requireRole, requireAdmin } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Parent routes
router.get('/family', requireRole(['parent']), familyController.getFamilyMembers);
router.get('/family/add-member', requireRole(['parent']), requireAdmin, familyController.getAddMember);
router.post('/family/add-member', requireRole(['parent']), requireAdmin, familyController.postAddMember);
router.post('/family/reset-member-password', requireRole(['parent']), requireAdmin, familyController.postResetMemberPassword);
router.post('/family/disable-member', requireRole(['parent']), requireAdmin, familyController.postDisableMember);
router.post('/family/restore-member', requireRole(['parent']), requireAdmin, familyController.postRestoreMember);

module.exports = router;
