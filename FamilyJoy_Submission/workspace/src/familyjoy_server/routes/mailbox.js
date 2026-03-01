/** Module: mailbox. Handles mailbox responsibilities. */

const express = require('express');
const router = express.Router();
const mailboxController = require('../controllers/mailboxController');
const { requireAuth, requirePasswordChange, requireRole } = require('../middleware/auth');

router.use(requireAuth, requirePasswordChange);

// Parent + Child routes
router.get('/mailbox/data', requireRole(['parent', 'child']), mailboxController.getMailboxData);
router.get('/mailbox/summary', requireRole(['parent', 'child']), mailboxController.getMailboxSummary);
router.post('/mailbox/mark-read', requireRole(['parent', 'child']), mailboxController.postMailboxMarkRead);
router.post('/mailbox/mark-read/:id', requireRole(['parent', 'child']), mailboxController.postMailboxMarkReadById);

module.exports = router;
