/** Module: spiritTree. Handles spiritTree responsibilities. */

const express = require('express');
const router = express.Router();
const spiritTreeController = require('../controllers/spiritTreeController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

router.get('/spirit-tree/me', requireRole(['child']), spiritTreeController.getMyCurrent);

router.get('/spirit-tree/family', requireRole(['parent']), spiritTreeController.getFamilyCurrent);
router.get('/spirit-tree/child/:childId', requireRole(['parent']), spiritTreeController.getChildCurrent);
router.get('/spirit-tree/child/:childId/history', requireRole(['parent']), spiritTreeController.getChildHistory);

router.post('/spirit-tree/child/:childId/sync-yesterday', requireRole(['parent']), spiritTreeController.postSyncYesterday);
router.post('/spirit-tree/child/:childId', requireRole(['parent']), spiritTreeController.postUpsertManual);

router.delete('/spirit-tree/child/:childId', requireRole(['parent']), spiritTreeController.deleteChildCurrent);
router.delete('/spirit-tree/child/:childId/history/:snapshotDate', requireRole(['parent']), spiritTreeController.deleteChildHistoryByDate);

module.exports = router;
