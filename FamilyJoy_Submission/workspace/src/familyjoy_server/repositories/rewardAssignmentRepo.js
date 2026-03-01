/** Module: rewardAssignmentRepo. Handles rewardAssignmentRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * listAssignmentsByFamily: executes this module action.
 */
async function listAssignmentsByFamily(familyId) {
  const [rows] = await db.promise.query(
    `SELECT rca.reward_id, rca.child_id, rca.quantity, u.nickname, u.username
     FROM reward_child_assignments rca
     JOIN users u ON rca.child_id = u.id
     JOIN rewards r ON rca.reward_id = r.id
     WHERE r.family_id = ?
     ORDER BY u.created_at`,
    [familyId]
  );
  return rows || [];
}

/**
 * upsertAssignment: executes this module action.
 */
async function upsertAssignment({ rewardId, childId, quantity }) {
  await db.promise.query(
    `INSERT INTO reward_child_assignments (id, reward_id, child_id, quantity, created_at, updated_at)
     VALUES (UUID(), ?, ?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), updated_at = NOW()`,
    [rewardId, childId, quantity]
  );
}

/**
 * deleteAssignment: executes this module action.
 */
async function deleteAssignment({ rewardId, childId }) {
  await db.promise.query(
    'DELETE FROM reward_child_assignments WHERE reward_id = ? AND child_id = ?',
    [rewardId, childId]
  );
}

/**
 * getAssignmentForUpdate: executes this module action.
 */
async function getAssignmentForUpdate(conn, rewardId, childId) {
  const [rows] = await conn.query(
    'SELECT id, quantity FROM reward_child_assignments WHERE reward_id = ? AND child_id = ? FOR UPDATE',
    [rewardId, childId]
  );
  return rows?.[0] ?? null;
}

/**
 * decrementQuantity: executes this module action.
 */
async function decrementQuantity(conn, assignmentId) {
  await conn.query(
    'UPDATE reward_child_assignments SET quantity = quantity - 1 WHERE id = ?',
    [assignmentId]
  );
}

/**
 * listAssignedRewardsForChild: executes this module action.
 */
async function listAssignedRewardsForChild(childId) {
  const [rows] = await db.promise.query(
    `SELECT r.id, r.name, r.description, r.icon_key, r.price, r.status,
            rca.quantity
     FROM reward_child_assignments rca
     JOIN rewards r ON rca.reward_id = r.id
     WHERE rca.child_id = ?
     ORDER BY r.name ASC`,
    [childId]
  );
  return rows || [];
}

module.exports = {
  listAssignmentsByFamily,
  upsertAssignment,
  deleteAssignment,
  getAssignmentForUpdate,
  decrementQuantity,
  listAssignedRewardsForChild
};
