/** Module: maintenanceService. Handles maintenanceService responsibilities. */

const userRepo = require('../repositories/userRepo');
const questRepo = require('../repositories/questRepo');
const sessionRepo = require('../repositories/sessionRepo');
const db = require('../models/db-connector');

/**
 * cleanupDisabledMembers: executes this module action.
 */
async function cleanupDisabledMembers() {
  const [rows] = await db.promise.query(
    "SELECT id FROM users WHERE status = 'disabled' AND delete_after IS NOT NULL AND delete_after <= NOW()"
  );

  if (!rows || rows.length === 0) {
    return;
  }

  for (const row of rows) {
    await questRepo.deleteDailyQuestsByUser(row.id);
    await sessionRepo.deleteSessionsByUserId(row.id);
    await userRepo.deleteById(row.id);
  }
}

module.exports = {
  cleanupDisabledMembers
};
