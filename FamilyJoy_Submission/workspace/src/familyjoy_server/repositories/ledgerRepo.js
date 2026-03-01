/** Module: ledgerRepo. Handles ledgerRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * insertLedger: executes this module action.
 */
async function insertLedger(conn, row) {
  const { id, userId, amount, type, sourceId } = row;
  await conn.query(
    'INSERT INTO crystal_ledger (id, user_id, amount, type, source_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [id, userId, amount, type, sourceId || null]
  );
}

module.exports = {
  insertLedger
};
