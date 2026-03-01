/** Module: mailboxController. Handles mailboxController responsibilities. */

const mailboxService = require('../services/mailboxService');

/**
 * getMailboxData: executes this module action.
 */
exports.getMailboxData = async (req, res) => {
  const user = req.session.user;
  const messages = await mailboxService.listByUser(user.id);
  res.json({ messages });
};

/**
 * getMailboxSummary: executes this module action.
 */
exports.getMailboxSummary = async (req, res) => {
  const user = req.session.user;
  const unreadCount = await mailboxService.countUnread(user.id);
  res.json({ unreadCount });
};

/**
 * postMailboxMarkRead: executes this module action.
 */
exports.postMailboxMarkRead = async (req, res) => {
  const user = req.session.user;
  await mailboxService.markAllRead(user.id);
  res.json({ ok: true });
};

/**
 * postMailboxMarkReadById: executes this module action.
 */
exports.postMailboxMarkReadById = async (req, res) => {
  const user = req.session.user;
  const mailboxId = req.params.id;
  await mailboxService.markReadById(user.id, mailboxId);
  const unreadCount = await mailboxService.countUnread(user.id);
  res.json({ ok: true, unreadCount });
};
