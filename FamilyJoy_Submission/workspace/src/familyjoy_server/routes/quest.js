/** Module: quest. Handles quest responsibilities. */

const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

router.get('/quest', requireRole(['parent', 'child']), questController.getQuestHome);

// Parent routes
router.post('/quest/book/create', requireRole(['parent']), questController.postCreateQuest);
router.post('/quest/book/edit/:id', requireRole(['parent']), questController.postEditQuest);
router.post('/quest/book/delete/:id', requireRole(['parent']), questController.postDeleteQuest);

router.post('/quest/assign/add', requireRole(['parent']), questController.postAssignQuest);
router.post('/quest/assign/remove', requireRole(['parent']), questController.postRemoveAssignedQuest);

router.post('/quest/review/confirm/:id', requireRole(['parent']), questController.postReviewConfirm);

// Child routes
router.get('/quest/today', requireRole(['child']), questController.getQuestToday);
router.get('/quest/tomorrow', requireRole(['child']), questController.getQuestTomorrow);
router.get('/quest/detail/:dailyQuestId', requireRole(['child']), questController.getQuestDetail);
router.post('/quest/detail/:dailyQuestId/submit', requireRole(['child']), questController.postQuestSubmit);

module.exports = router;
