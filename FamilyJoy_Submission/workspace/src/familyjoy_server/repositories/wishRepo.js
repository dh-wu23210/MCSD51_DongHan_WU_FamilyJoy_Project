/** Module: wishRepo. Handles wishRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * listOpenByChild: executes this module action.
 */
async function listOpenByChild(childId) {
  const [rows] = await db.promise.query(
    `SELECT w.id, w.child_id, w.reward_id, w.slot_code, w.created_at,
            r.name, r.description, r.icon_key
     FROM wishes w
     JOIN rewards r ON w.reward_id = r.id
     WHERE w.child_id = ? AND w.status = 'open'
     ORDER BY w.created_at ASC`,
    [childId]
  );
  return rows || [];
}

/**
 * listOpenByFamily: executes this module action.
 */
async function listOpenByFamily(familyId) {
  const [rows] = await db.promise.query(
    `SELECT w.id, w.child_id, w.reward_id, w.slot_code, w.created_at,
            r.name, r.description, r.icon_key,
            u.nickname, u.username
     FROM wishes w
     JOIN rewards r ON w.reward_id = r.id
     JOIN users u ON w.child_id = u.id
     WHERE w.family_id = ? AND w.status = 'open'
     ORDER BY u.created_at, w.created_at ASC`,
    [familyId]
  );
  return rows || [];
}

/**
 * listOpenSlots: executes this module action.
 */
async function listOpenSlots(childId, conn) {
  const connection = conn || db.promise;
  const [rows] = await connection.query(
    'SELECT slot_code FROM wishes WHERE child_id = ? AND status = "open"',
    [childId]
  );
  return (rows || []).map((row) => row.slot_code);
}

/**
 * insertWish: executes this module action.
 */
async function insertWish(conn, row) {
  const { id, childId, familyId, rewardId, slotCode } = row;
  await conn.query(
    'INSERT INTO wishes (id, child_id, family_id, reward_id, slot_code, status, created_at) VALUES (?, ?, ?, ?, ?, "open", NOW())',
    [id, childId, familyId, rewardId, slotCode]
  );
}

/**
 * getWishForUpdate: executes this module action.
 */
async function getWishForUpdate(conn, wishId) {
  const [rows] = await conn.query(
    `SELECT w.id, w.child_id, w.family_id, w.reward_id, w.status, w.slot_code,
            r.name, r.description, r.icon_key,
            u.nickname, u.username
     FROM wishes w
     JOIN rewards r ON w.reward_id = r.id
     JOIN users u ON w.child_id = u.id
     WHERE w.id = ?
     FOR UPDATE`,
    [wishId]
  );
  return rows?.[0] ?? null;
}

/**
 * acceptWish: executes this module action.
 */
async function acceptWish(conn, wishId) {
  await conn.query(
    'UPDATE wishes SET status = "accepted", accepted_at = NOW() WHERE id = ? AND status = "open"',
    [wishId]
  );
}

module.exports = {
  listOpenByChild,
  listOpenByFamily,
  listOpenSlots,
  insertWish,
  getWishForUpdate,
  acceptWish
};
