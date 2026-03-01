/** Module: backpackRepo. Handles backpackRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * listTopItems: executes this module action.
 */
async function listTopItems(childId, limit) {
  const [rows] = await db.promise.query(
    `SELECT cbi.reward_id, cbi.quantity, r.name, r.description, r.icon_key
     FROM child_backpack_items cbi
     JOIN rewards r ON cbi.reward_id = r.id
     WHERE cbi.child_id = ?
     ORDER BY r.name ASC
     LIMIT ?`,
    [childId, limit]
  );
  return rows || [];
}

/**
 * listAllItems: executes this module action.
 */
async function listAllItems(childId) {
  const [rows] = await db.promise.query(
    `SELECT cbi.reward_id, cbi.quantity, r.name, r.description, r.icon_key
     FROM child_backpack_items cbi
     JOIN rewards r ON cbi.reward_id = r.id
     WHERE cbi.child_id = ?
     ORDER BY r.name ASC`,
    [childId]
  );
  return rows || [];
}


/**
 * getItemForUpdate: executes this module action.
 */
async function getItemForUpdate(conn, childId, rewardId) {
  const [rows] = await conn.query(
    `SELECT cbi.reward_id, cbi.quantity, r.name, r.description, r.icon_key
     FROM child_backpack_items cbi
     JOIN rewards r ON cbi.reward_id = r.id
     WHERE cbi.child_id = ? AND cbi.reward_id = ?
     FOR UPDATE`,
    [childId, rewardId]
  );
  return rows?.[0] ?? null;
}

/**
 * decrementItem: executes this module action.
 */
async function decrementItem(conn, childId, rewardId) {
  await conn.query(
    'UPDATE child_backpack_items SET quantity = quantity - 1, updated_at = NOW() WHERE child_id = ? AND reward_id = ? AND quantity > 0',
    [childId, rewardId]
  );
  await conn.query(
    'DELETE FROM child_backpack_items WHERE child_id = ? AND reward_id = ? AND quantity <= 0',
    [childId, rewardId]
  );
}

/**
 * upsertIncrement: executes this module action.
 */
async function upsertIncrement(conn, childId, rewardId) {
  await conn.query(
    `INSERT INTO child_backpack_items (id, child_id, reward_id, quantity, created_at, updated_at)
     VALUES (UUID(), ?, ?, 1, NOW(), NOW())
     ON DUPLICATE KEY UPDATE quantity = quantity + 1, updated_at = NOW()`,
    [childId, rewardId]
  );
}

module.exports = {
  listTopItems,
  listAllItems,
  upsertIncrement,
  getItemForUpdate,
  decrementItem
};
