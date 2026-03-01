/** Module: rewardRepo. Handles rewardRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * listByFamily: executes this module action.
 */
async function listByFamily(familyId) {
  const [rows] = await db.promise.query(
    'SELECT id, family_id, name, description, icon_key, price, status, created_at FROM rewards WHERE family_id = ? ORDER BY created_at DESC',
    [familyId]
  );
  return rows || [];
}

/**
 * getByIdAndFamily: executes this module action.
 */
async function getByIdAndFamily(id, familyId) {
  const [rows] = await db.promise.query(
    'SELECT id, family_id, name, description, icon_key, price, status FROM rewards WHERE id = ? AND family_id = ?',
    [id, familyId]
  );
  return rows?.[0] ?? null;
}

/**
 * getById: executes this module action.
 */
async function getById(id) {
  const [rows] = await db.promise.query(
    'SELECT id, family_id, name, description, icon_key, price, status FROM rewards WHERE id = ?',
    [id]
  );
  return rows?.[0] ?? null;
}

/**
 * getByIdForUpdate: executes this module action.
 */
async function getByIdForUpdate(conn, id) {
  const [rows] = await conn.query(
    'SELECT id, family_id, name, description, icon_key, price, status FROM rewards WHERE id = ? FOR UPDATE',
    [id]
  );
  return rows?.[0] ?? null;
}

/**
 * insertReward: executes this module action.
 */
async function insertReward(reward) {
  const { id, familyId, name, description, iconKey, price } = reward;
  await db.promise.query(
    'INSERT INTO rewards (id, family_id, name, description, icon_key, price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
    [id, familyId, name, description, iconKey, price, 'active']
  );
}

/**
 * updateReward: executes this module action.
 */
async function updateReward(reward) {
  const { id, familyId, name, description, iconKey, price } = reward;
  await db.promise.query(
    'UPDATE rewards SET name = ?, description = ?, icon_key = ?, price = ? WHERE id = ? AND family_id = ?',
    [name, description, iconKey, price, id, familyId]
  );
}

/**
 * updateRewardStatus: executes this module action.
 */
async function updateRewardStatus(id, familyId, status) {
  await db.promise.query(
    'UPDATE rewards SET status = ? WHERE id = ? AND family_id = ?',
    [status, id, familyId]
  );
}

module.exports = {
  listByFamily,
  getByIdAndFamily,
  getById,
  getByIdForUpdate,
  insertReward,
  updateReward,
  updateRewardStatus
};
