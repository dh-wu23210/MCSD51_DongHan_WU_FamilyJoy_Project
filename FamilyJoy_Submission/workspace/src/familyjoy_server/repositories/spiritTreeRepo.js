/** Module: spiritTreeRepo. Handles spiritTreeRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * mapRow: executes this module action.
 */
function mapRow(row) {
  if (!row) return null;
  return {
    childId: row.child_id,
    familyId: row.family_id,
    state: row.state,
    completionRate: Number(row.completion_rate || 0),
    sourceDate: row.source_date,
    lastCalculatedAt: row.last_calculated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * getCurrentByChildId: executes this module action.
 */
async function getCurrentByChildId(childId) {
  const [rows] = await db.promise.query(
    `SELECT child_id, family_id, state, completion_rate, source_date, last_calculated_at, created_at, updated_at
     FROM child_spirit_tree
     WHERE child_id = ?
     LIMIT 1`,
    [childId]
  );
  return mapRow(rows?.[0]);
}

/**
 * listCurrentByFamilyId: executes this module action.
 */
async function listCurrentByFamilyId(familyId) {
  const [rows] = await db.promise.query(
    `SELECT child_id, family_id, state, completion_rate, source_date, last_calculated_at, created_at, updated_at
     FROM child_spirit_tree
     WHERE family_id = ?`,
    [familyId]
  );
  return (rows || []).map(mapRow);
}

/**
 * upsertCurrent: executes this module action.
 */
async function upsertCurrent(row) {
  const {
    childId,
    familyId,
    state,
    completionRate,
    sourceDate
  } = row;

  await db.promise.query(
    `INSERT INTO child_spirit_tree (
      child_id, family_id, state, completion_rate, source_date, last_calculated_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      family_id = VALUES(family_id),
      state = VALUES(state),
      completion_rate = VALUES(completion_rate),
      source_date = VALUES(source_date),
      last_calculated_at = NOW(),
      updated_at = NOW()`,
    [childId, familyId, state, completionRate, sourceDate]
  );
}

/**
 * deleteCurrentByChildId: executes this module action.
 */
async function deleteCurrentByChildId(childId, familyId) {
  const [result] = await db.promise.query(
    'DELETE FROM child_spirit_tree WHERE child_id = ? AND family_id = ?',
    [childId, familyId]
  );
  return Number(result?.affectedRows || 0);
}

/**
 * upsertDailySnapshot: executes this module action.
 */
async function upsertDailySnapshot(row) {
  const {
    childId,
    familyId,
    snapshotDate,
    state,
    completionRate
  } = row;

  await db.promise.query(
    `INSERT INTO child_spirit_tree_daily (
      child_id, family_id, snapshot_date, state, completion_rate, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      family_id = VALUES(family_id),
      state = VALUES(state),
      completion_rate = VALUES(completion_rate),
      updated_at = NOW()`,
    [childId, familyId, snapshotDate, state, completionRate]
  );
}

/**
 * listDailyByChildId: executes this module action.
 */
async function listDailyByChildId(childId, limit) {
  const safeLimit = Math.max(1, Number(limit) || 30);
  const [rows] = await db.promise.query(
    `SELECT child_id, family_id, snapshot_date, state, completion_rate, created_at, updated_at
     FROM child_spirit_tree_daily
     WHERE child_id = ?
     ORDER BY snapshot_date DESC
     LIMIT ${safeLimit}`,
    [childId]
  );
  return (rows || []).map((row) => ({
    childId: row.child_id,
    familyId: row.family_id,
    snapshotDate: row.snapshot_date,
    state: row.state,
    completionRate: Number(row.completion_rate || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

/**
 * deleteDailyByChildIdAndDate: executes this module action.
 */
async function deleteDailyByChildIdAndDate(childId, familyId, snapshotDate) {
  const [result] = await db.promise.query(
    'DELETE FROM child_spirit_tree_daily WHERE child_id = ? AND family_id = ? AND snapshot_date = ?',
    [childId, familyId, snapshotDate]
  );
  return Number(result?.affectedRows || 0);
}

module.exports = {
  getCurrentByChildId,
  listCurrentByFamilyId,
  upsertCurrent,
  deleteCurrentByChildId,
  upsertDailySnapshot,
  listDailyByChildId,
  deleteDailyByChildIdAndDate
};
