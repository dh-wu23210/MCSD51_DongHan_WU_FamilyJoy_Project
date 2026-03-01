/** Module: shop. Handles shop responsibilities. */

const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Parent + Child routes
router.get('/shop', requireRole(['parent', 'child']), shopController.getShopHome);

// Child routes
router.post('/shop/buy/:rewardId', requireRole(['child']), shopController.postPurchaseReward);

// Parent routes
router.get('/shop/library', requireRole(['parent']), shopController.getRewardLibrary);
router.get('/shop/assign/:childId', requireRole(['parent']), shopController.getChildShopManage);
router.post('/shop/reward/create', requireRole(['parent']), shopController.postCreateReward);
router.post('/shop/reward/edit/:id', requireRole(['parent']), shopController.postEditReward);
router.post('/shop/reward/toggle/:id', requireRole(['parent']), shopController.postToggleReward);
router.post('/shop/reward/delete/:id', requireRole(['parent']), shopController.postDeleteReward);
router.post('/shop/reward/assign', requireRole(['parent']), shopController.postAssignReward);
router.post('/shop/reward/unassign', requireRole(['parent']), shopController.postUnassignReward);

module.exports = router;
