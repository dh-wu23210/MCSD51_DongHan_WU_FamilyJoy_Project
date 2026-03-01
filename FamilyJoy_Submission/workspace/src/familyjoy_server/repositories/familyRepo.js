/** Module: familyRepo. Handles familyRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * familyCodeExists: executes this module action.
 */
async function familyCodeExists(familyCode) {
  const [rows] = await db.promise.query('SELECT id FROM families WHERE family_code = ?', [familyCode]);
  return (rows?.length || 0) > 0;
}

/**
 * insertFamily: executes this module action.
 */
async function insertFamily(family, conn = null) {
  const { id, name, familyCode } = family;
  const executor = conn || db.promise;
  await executor.query(
    'INSERT INTO families (id, name, family_code) VALUES (?, ?, ?)',
    [id, name, familyCode]
  );
}

/**
 * getFamilyById: executes this module action.
 */
async function getFamilyById(familyId) {
  const [rows] = await db.promise.query('SELECT id, name, family_code FROM families WHERE id = ?', [familyId]);
  return rows?.[0] ?? null;
}

/**
 * getFamilyCodeById: executes this module action.
 */
async function getFamilyCodeById(familyId) {
  const [rows] = await db.promise.query('SELECT family_code FROM families WHERE id = ?', [familyId]);
  return rows?.[0]?.family_code ?? '';
}

module.exports = {
  familyCodeExists,
  insertFamily,
  getFamilyById,
  getFamilyCodeById
};
