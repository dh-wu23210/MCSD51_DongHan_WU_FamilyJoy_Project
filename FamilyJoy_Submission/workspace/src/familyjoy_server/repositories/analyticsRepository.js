/** Module: analyticsRepository. Handles analyticsRepository responsibilities. */

const db = require('../models/db-connector');

let loginEventsTableEnsured = false;

/**
 * ensureLoginEventsTable: executes this module action.
 */
async function ensureLoginEventsTable() {
  if (loginEventsTableEnsured) return;
  await db.promise.query(`
    CREATE TABLE IF NOT EXISTS user_login_events (
      id CHAR(36) NOT NULL,
      user_id CHAR(36) NOT NULL,
      family_id CHAR(36) NOT NULL,
      login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      PRIMARY KEY (id),
      KEY idx_ule_login_at (login_at),
      KEY idx_ule_user_login_at (user_id, login_at),
      KEY idx_ule_family_login_at (family_id, login_at),
      CONSTRAINT fk_ule_user FOREIGN KEY (user_id) REFERENCES users(id),
      CONSTRAINT fk_ule_family FOREIGN KEY (family_id) REFERENCES families(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  loginEventsTableEnsured = true;
}

/**
 * insertUserLoginEvent: executes this module action.
 */
async function insertUserLoginEvent({ id, userId, familyId, loginAt }) {
  await ensureLoginEventsTable();
  await db.promise.query(
    `INSERT INTO user_login_events (id, user_id, family_id, login_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, userId, familyId, loginAt, loginAt]
  );
}

module.exports = {
  ensureLoginEventsTable,
  insertUserLoginEvent
};

