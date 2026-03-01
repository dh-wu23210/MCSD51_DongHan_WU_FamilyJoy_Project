/** Module: sessionRepo. Handles sessionRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * updateSessionUserId: executes this module action.
 */
async function updateSessionUserId(sessionId, userId) {
  await db.promise.query('UPDATE sessions SET user_id = ? WHERE session_id = ?', [userId, sessionId]);
}

/**
 * deleteSessionsByUserId: executes this module action.
 */
async function deleteSessionsByUserId(userId) {
  await db.promise.query('DELETE FROM sessions WHERE user_id = ? OR data LIKE ?', [userId, `%"id":"${userId}"%`]);
}

module.exports = {
  updateSessionUserId,
  deleteSessionsByUserId
};
