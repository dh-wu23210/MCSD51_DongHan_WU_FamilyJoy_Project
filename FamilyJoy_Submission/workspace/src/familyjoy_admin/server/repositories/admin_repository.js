/** Module: admin_repository. Handles admin repository behavior. */

const db = require('../../../familyjoy_server/models/db-connector');

const PAGE_SIZE = 10;
let loginEventsTableEnsured = false;

/**
 * buildLike: executes this module action.
 */
function buildLike(value) {
  return `%${value}%`;
}

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
 * findAdminUser: executes this module action.
 */
async function findAdminUser(username) {
  const [rows] = await db.promise.query(
    'SELECT id, username, password_hash, status, last_login_at, created_at FROM system_admins WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] || null;
}

/**
 * touchAdminLogin: executes this module action.
 */
async function touchAdminLogin(adminId) {
  await db.promise.query(
    'UPDATE system_admins SET last_login_at = NOW() WHERE id = ?',
    [adminId]
  );
}

/**
 * getDashboardTotals: executes this module action.
 */
async function getDashboardTotals() {
  const [userRows] = await db.promise.query(
    'SELECT COUNT(*) AS total_users FROM users'
  );
  const [familyRows] = await db.promise.query(
    'SELECT COUNT(*) AS total_families FROM families'
  );
  return {
    totalUsers: Number(userRows[0]?.total_users || 0),
    totalFamilies: Number(familyRows[0]?.total_families || 0)
  };
}

/**
 * getTodayActivityMetrics: executes this module action.
 */
async function getTodayActivityMetrics() {
  await ensureLoginEventsTable();
  const [activeUserRows] = await db.promise.query(
    `SELECT COUNT(DISTINCT e.user_id) AS active_users
      FROM user_login_events e
      JOIN users u ON u.id = e.user_id
      WHERE e.login_at >= CURDATE()
        AND e.login_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
    []
  );

  const [activeFamilyRows] = await db.promise.query(
    `SELECT COUNT(DISTINCT e.family_id) AS active_families
      FROM user_login_events e
      JOIN users u ON u.id = e.user_id
      WHERE e.login_at >= CURDATE()
        AND e.login_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
    []
  );

  return {
    activeUsersToday: Number(activeUserRows[0]?.active_users || 0),
    activeFamiliesToday: Number(activeFamilyRows[0]?.active_families || 0)
  };
}

/**
 * getTodayNewMetrics: executes this module action.
 */
async function getTodayNewMetrics() {
  const [newUserRows] = await db.promise.query(
    `SELECT COUNT(*) AS new_users
       FROM users
      WHERE created_at >= CURDATE()
        AND created_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
    []
  );

  const [newFamilyRows] = await db.promise.query(
    `SELECT COUNT(*) AS new_families
       FROM families
      WHERE created_at >= CURDATE()
        AND created_at < DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
    []
  );

  return {
    newUsersToday: Number(newUserRows[0]?.new_users || 0),
    newFamiliesToday: Number(newFamilyRows[0]?.new_families || 0)
  };
}

/**
 * getDailyActiveUsers: executes this module action.
 */
async function getDailyActiveUsers(dayOffset) {
  await ensureLoginEventsTable();
  const [rows] = await db.promise.query(
    `SELECT COUNT(DISTINCT e.user_id) AS active_users
      FROM user_login_events e
      JOIN users u ON u.id = e.user_id
      WHERE e.login_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND e.login_at < DATE_ADD(DATE_SUB(CURDATE(), INTERVAL ? DAY), INTERVAL 1 DAY)`,
    [dayOffset, dayOffset]
  );
  return Number(rows[0]?.active_users || 0);
}

/**
 * findUsers: executes this module action.
 */
async function findUsers({ qUser = '', qFamily = '', page = 1 }) {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * PAGE_SIZE;
  const userFilter = qUser.trim();
  const familyFilter = qFamily.trim();

  const where = [];
  const params = [];

  if (userFilter) {
    where.push('u.username LIKE ?');
    params.push(buildLike(userFilter));
  }
  if (familyFilter) {
    where.push('f.name LIKE ?');
    params.push(buildLike(familyFilter));
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await db.promise.query(
    `SELECT COUNT(*) AS total
       FROM users u
       JOIN families f ON f.id = u.family_id
       ${whereSql}`,
    params
  );

  const [rows] = await db.promise.query(
    `SELECT u.id, u.username, u.nickname, u.role, u.status, u.created_at, f.id AS family_id, f.name AS family_name, f.family_code
       FROM users u
       JOIN families f ON f.id = u.family_id
       ${whereSql}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?`,
    [...params, PAGE_SIZE, offset]
  );

  return {
    rows,
    total: Number(countRows[0]?.total || 0),
    page: safePage,
    pageSize: PAGE_SIZE
  };
}

/**
 * findFamilies: executes this module action.
 */
async function findFamilies({ qUser = '', qFamily = '', page = 1 }) {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * PAGE_SIZE;
  const userFilter = qUser.trim();
  const familyFilter = qFamily.trim();

  const where = ['EXISTS (SELECT 1 FROM users ux WHERE ux.family_id = f.id)'];
  const params = [];

  if (familyFilter) {
    where.push('f.name LIKE ?');
    params.push(buildLike(familyFilter));
  }

  if (userFilter) {
    where.push('EXISTS (SELECT 1 FROM users uu WHERE uu.family_id = f.id AND uu.username LIKE ?)');
    params.push(buildLike(userFilter));
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await db.promise.query(
    `SELECT COUNT(*) AS total
       FROM families f
       ${whereSql}`,
    params
  );

  const [rows] = await db.promise.query(
    `SELECT f.id, f.name, f.family_code, f.created_at,
            COUNT(u.id) AS member_count
      FROM families f
      LEFT JOIN users u ON u.family_id = f.id
       ${whereSql}
      GROUP BY f.id, f.name, f.family_code, f.created_at
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?`,
    [...params, PAGE_SIZE, offset]
  );

  return {
    rows,
    total: Number(countRows[0]?.total || 0),
    page: safePage,
    pageSize: PAGE_SIZE
  };
}

/**
 * getFamilyDetail: executes this module action.
 */
async function getFamilyDetail(familyId) {
  const [familyRows] = await db.promise.query(
    'SELECT id, name, family_code, created_at FROM families WHERE id = ? LIMIT 1',
    [familyId]
  );
  const family = familyRows[0] || null;
  if (!family) return null;

  const [memberRows] = await db.promise.query(
    `SELECT id, username, nickname, role, status, created_at
      FROM users
      WHERE family_id = ?
      ORDER BY created_at ASC`,
    [familyId]
  );

  return { family, members: memberRows };
}

/**
 * findAuditLogs: executes this module action.
 */
async function findAuditLogs({ qUser = '', qFamily = '', page = 1 }) {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * PAGE_SIZE;
  const userFilter = qUser.trim();
  const familyFilter = qFamily.trim();

  const where = [];
  const params = [];

  if (userFilter) {
    where.push('x.username LIKE ?');
    params.push(buildLike(userFilter));
  }
  if (familyFilter) {
    where.push('x.family_name LIKE ?');
    params.push(buildLike(familyFilter));
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const baseQuery = `
    SELECT s.created_at AS event_time,
           'LOGIN' AS action,
           u.username AS username,
           f.name AS family_name,
           'Session created' AS details
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      JOIN families f ON f.id = u.family_id
  `;

  const [countRows] = await db.promise.query(
    `SELECT COUNT(*) AS total
       FROM (${baseQuery}) x
      ${whereSql}`,
    params
  );

  const [rows] = await db.promise.query(
    `SELECT x.event_time, x.action, x.username, x.family_name, x.details
       FROM (${baseQuery}) x
      ${whereSql}
      ORDER BY x.event_time DESC
      LIMIT ? OFFSET ?`,
    [...params, PAGE_SIZE, offset]
  );

  return {
    rows,
    total: Number(countRows[0]?.total || 0),
    page: safePage,
    pageSize: PAGE_SIZE
  };
}

module.exports = {
  findAdminUser,
  touchAdminLogin,
  getDashboardTotals,
  getTodayActivityMetrics,
  getTodayNewMetrics,
  getDailyActiveUsers,
  findUsers,
  findFamilies,
  getFamilyDetail,
  findAuditLogs
};
