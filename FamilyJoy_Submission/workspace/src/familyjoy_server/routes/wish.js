/** Module: wish. Handles wish responsibilities. */

const express = require('express');
const router = express.Router();
const wishController = require('../controllers/wishController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Child routes
router.post('/wishes', requireRole(['child']), wishController.postCreateWish);
router.get('/wishes/me', requireRole(['child']), wishController.getChildWishes);

// Parent routes
router.post('/wishes/:id/accept', requireRole(['parent']), wishController.postAcceptWish);
router.get('/wishes/child/:childId', requireRole(['parent']), wishController.getWishesByChild);

module.exports = router;
