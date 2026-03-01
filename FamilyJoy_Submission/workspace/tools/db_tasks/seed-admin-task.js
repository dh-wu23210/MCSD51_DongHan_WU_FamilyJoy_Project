const crypto = require('crypto');

const ADMIN_FAMILY_CODE = 'ADMN';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123456';

async function ensureAdminTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS system_admins (
      id CHAR(36) NOT NULL,
      username VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      status ENUM('active','disabled') NOT NULL DEFAULT 'active',
      last_login_at DATETIME NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
      PRIMARY KEY (id),
      UNIQUE KEY uk_system_admin_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function cleanupLegacyAdminFromUsers(connection) {
  const [legacyRows] = await connection.query(
    'SELECT id, family_id FROM users WHERE username = ?',
    [ADMIN_USERNAME]
  );
  if (!legacyRows.length) return;

  for (const row of legacyRows) {
    await connection.query('DELETE FROM users WHERE id = ?', [row.id]);
    const [members] = await connection.query(
      'SELECT COUNT(*) AS total FROM users WHERE family_id = ?',
      [row.family_id]
    );
    if (Number(members[0]?.total || 0) === 0) {
      await connection.query('DELETE FROM families WHERE id = ? AND family_code = ?', [row.family_id, ADMIN_FAMILY_CODE]);
    }
  }
}

async function upsertSystemAdmin(connection, bcrypt) {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const [existing] = await connection.query(
    'SELECT id FROM system_admins WHERE username = ? LIMIT 1',
    [ADMIN_USERNAME]
  );

  if (existing.length) {
    await connection.query(
      `UPDATE system_admins
          SET password_hash = ?, status = 'active'
        WHERE id = ?`,
      [passwordHash, existing[0].id]
    );
    return existing[0].id;
  }

  const userId = crypto.randomUUID();
  await connection.query(
    `INSERT INTO system_admins
      (id, username, password_hash, status)
      VALUES (?, ?, ?, 'active')`,
    [userId, ADMIN_USERNAME, passwordHash]
  );
  return userId;
}

async function run({ connection, deps }) {
  const bcrypt = deps && deps.bcrypt;
  if (!bcrypt) {
    throw new Error('Missing bcrypt dependency.');
  }
  await ensureAdminTable(connection);
  await cleanupLegacyAdminFromUsers(connection);
  const userId = await upsertSystemAdmin(connection, bcrypt);
  console.log(`[seed-admin] Admin ready. admin_id=${userId}`);
  console.log(`[seed-admin] Credentials: ${ADMIN_USERNAME}/${ADMIN_PASSWORD}`);
}

module.exports = { run };
