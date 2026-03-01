/** Module: userRepo. Handles userRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * findByUsername: executes this module action.
 */
async function findByUsername(username) {
  const [rows] = await db.promise.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows?.[0] ?? null;
}

/**
 * findById: executes this module action.
 */
async function findById(id) {
  const [rows] = await db.promise.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows?.[0] ?? null;
}

/**
 * getStatusRoleAdminById: executes this module action.
 */
async function getStatusRoleAdminById(id) {
  const [rows] = await db.promise.query(
    'SELECT status, role, is_admin, crystal_balance, is_initial_password FROM users WHERE id = ?',
    [id]
  );
  return rows?.[0] ?? null;
}

/**
 * listUsernamesByFamily: executes this module action.
 */
async function listUsernamesByFamily(familyId) {
  const [rows] = await db.promise.query('SELECT username FROM users WHERE family_id = ?', [familyId]);
  return rows || [];
}

/**
 * listMembersByFamily: executes this module action.
 */
async function listMembersByFamily(familyId) {
  const [rows] = await db.promise.query(
    'SELECT id, username, nickname, role, status, created_at, is_initial_password, is_admin, disabled_at, delete_after FROM users WHERE family_id = ? ORDER BY created_at',
    [familyId]
  );
  return rows || [];
}

/**
 * listActiveChildrenByFamily: executes this module action.
 */
async function listActiveChildrenByFamily(familyId) {
  const [rows] = await db.promise.query(
    "SELECT id, username, nickname FROM users WHERE family_id = ? AND role = 'child' AND status = 'active' ORDER BY created_at",
    [familyId]
  );
  return rows || [];
}

/**
 * getMemberByIdAndFamily: executes this module action.
 */
async function getMemberByIdAndFamily(memberId, familyId) {
  const [rows] = await db.promise.query(
    'SELECT id, role, is_admin, status FROM users WHERE id = ? AND family_id = ?',
    [memberId, familyId]
  );
  return rows?.[0] ?? null;
}

/**
 * getMemberByIdAndFamilyBasic: executes this module action.
 */
async function getMemberByIdAndFamilyBasic(memberId, familyId) {
  const [rows] = await db.promise.query(
    'SELECT id, role, is_admin FROM users WHERE id = ? AND family_id = ?',
    [memberId, familyId]
  );
  return rows?.[0] ?? null;
}

/**
 * insertUser: executes this module action.
 */
async function insertUser(user, conn = null) {
  const {
    id, familyId, username, passwordHash, nickname, role, isAdmin, isInitialPassword
  } = user;
  const executor = conn || db.promise;
  await executor.query(
    'INSERT INTO users (id, family_id, username, password_hash, nickname, role, is_admin, is_initial_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, familyId, username, passwordHash, nickname, role, isAdmin ? 1 : 0, isInitialPassword ? 1 : 0]
  );
}

/**
 * updateNickname: executes this module action.
 */
async function updateNickname(userId, nickname) {
  await db.promise.query('UPDATE users SET nickname = ? WHERE id = ?', [nickname, userId]);
}

/**
 * updateUsername: executes this module action.
 */
async function updateUsername(userId, username) {
  await db.promise.query('UPDATE users SET username = ? WHERE id = ?', [username, userId]);
}

/**
 * updatePassword: executes this module action.
 */
async function updatePassword(userId, passwordHash, isInitialPassword) {
  await db.promise.query(
    'UPDATE users SET password_hash = ?, is_initial_password = ? WHERE id = ?',
    [passwordHash, isInitialPassword ? 1 : 0, userId]
  );
}

/**
 * disableMember: executes this module action.
 */
async function disableMember(memberId) {
  await db.promise.query(
    "UPDATE users SET status = 'disabled', disabled_at = NOW(), delete_after = DATE_ADD(NOW(), INTERVAL 3 DAY) WHERE id = ?",
    [memberId]
  );
}

/**
 * restoreMember: executes this module action.
 */
async function restoreMember(memberId) {
  await db.promise.query(
    "UPDATE users SET status = 'active', disabled_at = NULL, delete_after = NULL WHERE id = ?",
    [memberId]
  );
}

/**
 * deleteById: executes this module action.
 */
async function deleteById(memberId) {
  await db.promise.query('DELETE FROM users WHERE id = ?', [memberId]);
}

/**
 * getCrystalBalanceById: executes this module action.
 */
async function getCrystalBalanceById(userId) {
  const [rows] = await db.promise.query('SELECT crystal_balance FROM users WHERE id = ?', [userId]);
  return rows?.[0]?.crystal_balance ?? 0;
}

/**
 * getCrystalBalanceForUpdate: executes this module action.
 */
async function getCrystalBalanceForUpdate(conn, userId) {
  const [rows] = await conn.query(
    'SELECT crystal_balance FROM users WHERE id = ? FOR UPDATE',
    [userId]
  );
  return rows?.[0]?.crystal_balance ?? 0;
}

/**
 * updateCrystalBalance: executes this module action.
 */
async function updateCrystalBalance(conn, userId, newBalance) {
  await conn.query(
    'UPDATE users SET crystal_balance = ? WHERE id = ?',
    [newBalance, userId]
  );
}

module.exports = {
  findByUsername,
  findById,
  getStatusRoleAdminById,
  listUsernamesByFamily,
  listMembersByFamily,
  listActiveChildrenByFamily,
  getMemberByIdAndFamily,
  getMemberByIdAndFamilyBasic,
  insertUser,
  updateNickname,
  updateUsername,
  updatePassword,
  disableMember,
  restoreMember,
  deleteById,
  getCrystalBalanceById,
  getCrystalBalanceForUpdate,
  updateCrystalBalance
};
