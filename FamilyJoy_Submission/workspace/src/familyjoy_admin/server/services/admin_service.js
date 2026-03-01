/** Module: admin_service. Handles admin service behavior. */

const bcrypt = require('bcryptjs');
const adminRepo = require('../repositories/admin_repository');

/**
 * normalizePage: executes this module action.
 */
function normalizePage(pageRaw) {
  const parsed = parseInt(pageRaw, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

/**
 * buildPagination: executes this module action.
 */
function buildPagination(total, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return { total, page: safePage, pageSize, totalPages };
}

/**
 * loginAdmin: executes this module action.
 */
async function loginAdmin(username, password) {
  const safeUsername = String(username || '').trim();
  if (!safeUsername || !password) {
    throw new Error('Username and password are required');
  }

  const user = await adminRepo.findAdminUser(safeUsername);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new Error('Admin account is not active');
  }

  // Sprint 8 MVP: system admin identity is bound to explicit admin account username.
  if (user.username !== 'admin') {
    throw new Error('Invalid credentials');
  }

  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) {
    throw new Error('Invalid credentials');
  }

  await adminRepo.touchAdminLogin(user.id);

  return {
    id: user.id,
    name: user.username,
    role: 'system_admin',
    isAdmin: true,
    isSystemAdmin: true
  };
}

/**
 * getDashboardData: executes this module action.
 */
async function getDashboardData() {
  const totals = await adminRepo.getDashboardTotals();
  const todayActivity = await adminRepo.getTodayActivityMetrics();
  const todayNew = await adminRepo.getTodayNewMetrics();

  const trend = [];
  for (let offset = 0; offset <= 6; offset += 1) {
    const count = await adminRepo.getDailyActiveUsers(offset);
    const day = new Date();
    day.setDate(day.getDate() - offset);
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    trend.push({ date: `${yyyy}-${mm}-${dd}`, activeUsers: count });
  }

  return {
    totals,
    todayActivity,
    todayNew,
    trend
  };
}

/**
 * getUsersData: executes this module action.
 */
async function getUsersData(query) {
  const qUser = String(query.qUser || '').trim();
  const qFamily = String(query.qFamily || '').trim();
  const page = normalizePage(query.page);
  const result = await adminRepo.findUsers({ qUser, qFamily, page });
  return {
    filters: { qUser, qFamily },
    rows: result.rows,
    pagination: buildPagination(result.total, result.page, result.pageSize)
  };
}

/**
 * getFamiliesData: executes this module action.
 */
async function getFamiliesData(query) {
  const qUser = String(query.qUser || '').trim();
  const qFamily = String(query.qFamily || '').trim();
  const page = normalizePage(query.page);
  const result = await adminRepo.findFamilies({ qUser, qFamily, page });
  return {
    filters: { qUser, qFamily },
    rows: result.rows,
    pagination: buildPagination(result.total, result.page, result.pageSize)
  };
}

/**
 * getFamilyDetailData: executes this module action.
 */
async function getFamilyDetailData(familyId) {
  return adminRepo.getFamilyDetail(familyId);
}

/**
 * getAuditLogsData: executes this module action.
 */
async function getAuditLogsData(query) {
  const qUser = String(query.qUser || '').trim();
  const qFamily = String(query.qFamily || '').trim();
  const page = normalizePage(query.page);
  const result = await adminRepo.findAuditLogs({ qUser, qFamily, page });
  return {
    filters: { qUser, qFamily },
    rows: result.rows,
    pagination: buildPagination(result.total, result.page, result.pageSize)
  };
}

module.exports = {
  loginAdmin,
  getDashboardData,
  getUsersData,
  getFamiliesData,
  getFamilyDetailData,
  getAuditLogsData
};
