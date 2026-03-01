/** Module: mailboxRepo. Handles mailboxRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * insertNotification: executes this module action.
 */
async function insertNotification(conn, row) {
  const { id, userId, type, amount, sourceId, title, message } = row;
  await conn.query(
    'INSERT INTO mailbox_messages (id, user_id, type, amount, source_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())',
    [id, userId, type, amount, sourceId || null, title, message]
  );
}

/**
 * insertNotificationStandalone: executes this module action.
 */
async function insertNotificationStandalone(row) {
  const { id, userId, type, amount, sourceId, title, message } = row;
  await db.promise.query(
    'INSERT INTO mailbox_messages (id, user_id, type, amount, source_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())',
    [id, userId, type, amount, sourceId || null, title, message]
  );
}

/**
 * listByUser: executes this module action.
 */
async function listByUser(userId) {
  const [rows] = await db.promise.query(
    'SELECT id, type, amount, title, message, is_read, created_at FROM mailbox_messages WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows || [];
}

/**
 * countUnread: executes this module action.
 */
async function countUnread(userId) {
  const [rows] = await db.promise.query(
    'SELECT COUNT(*) as count FROM mailbox_messages WHERE user_id = ? AND is_read = 0',
    [userId]
  );
  return Number(rows?.[0]?.count || 0);
}

/**
 * markAllRead: executes this module action.
 */
async function markAllRead(userId) {
  await db.promise.query(
    'UPDATE mailbox_messages SET is_read = 1 WHERE user_id = ? AND is_read = 0',
    [userId]
  );
}

/**
 * markReadById: executes this module action.
 */
async function markReadById(userId, mailboxId) {
  await db.promise.query(
    'UPDATE mailbox_messages SET is_read = 1 WHERE user_id = ? AND id = ?',
    [userId, mailboxId]
  );
}

module.exports = {
  insertNotification,
  insertNotificationStandalone,
  listByUser,
  countUnread,
  markAllRead,
  markReadById
};
