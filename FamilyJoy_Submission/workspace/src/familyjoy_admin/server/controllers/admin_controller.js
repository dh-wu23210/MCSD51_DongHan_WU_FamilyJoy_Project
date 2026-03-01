/** Module: admin_controller. Handles admin controller behavior. */

const adminService = require('../services/admin_service');
const { isSystemAdminSession } = require('../middleware/admin_auth');

/**
 * renderAdmin: executes this module action.
 */
function renderAdmin(req, res, view, data = {}) {
  const sessionUser = getSessionAdmin(req);
  return res.render(view, {
    layout: 'layouts/admin_layout',
    title: 'FamilyJoy Admin',
    current: 'dashboard',
    adminUser: sessionUser,
    ...data
  });
}

/**
 * getSessionAdmin: executes this module action.
 */
function getSessionAdmin(req) {
  return req.session && req.session.adminUser ? req.session.adminUser : null;
}

/**
 * getAdminEntry: executes this module action.
 */
exports.getAdminEntry = (req, res) => {
  if (isSystemAdminSession(getSessionAdmin(req))) {
    return res.redirect('/admin');
  }
  return res.redirect('/admin_login');
};

/**
 * getLogin: executes this module action.
 */
exports.getLogin = (req, res) => {
  if (isSystemAdminSession(getSessionAdmin(req))) {
    return res.redirect('/admin');
  }
  return renderAdmin(req, res, 'pages/admin_login', {
    title: 'Admin Login',
    error: req.query.error || ''
  });
};

/**
 * postLogin: executes this module action.
 */
exports.postLogin = async (req, res) => {
  try {
    const sessionUser = await adminService.loginAdmin(req.body.username, req.body.password);
    req.session.regenerate((regenErr) => {
      if (regenErr) {
        return renderAdmin(req, res, 'pages/admin_login', {
          title: 'Admin Login',
          error: 'Login failed. Please retry.'
        });
      }
      req.session.adminUser = sessionUser;
      req.session.save(() => res.redirect('/admin'));
    });
  } catch (error) {
    return renderAdmin(req, res, 'pages/admin_login', {
      title: 'Admin Login',
      error: error.message || 'Invalid credentials'
    });
  }
};

/**
 * postLogout: executes this module action.
 */
exports.postLogout = (req, res) => {
  if (!req.session) return res.redirect('/admin_login');
  req.session.adminUser = null;
  req.session.save(() => res.redirect('/admin_login'));
};

/**
 * getDashboard: executes this module action.
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardData();
    return renderAdmin(req, res, 'pages/admin_dashboard', {
      title: 'Admin Dashboard',
      current: 'dashboard',
      data
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * getUsers: executes this module action.
 */
exports.getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getUsersData(req.query || {});
    return renderAdmin(req, res, 'pages/admin_users', {
      title: 'Admin Users',
      current: 'users',
      data
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * getFamilies: executes this module action.
 */
exports.getFamilies = async (req, res, next) => {
  try {
    const data = await adminService.getFamiliesData(req.query || {});
    return renderAdmin(req, res, 'pages/admin_families', {
      title: 'Admin Families',
      current: 'families',
      data
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * getFamilyDetail: executes this module action.
 */
exports.getFamilyDetail = async (req, res, next) => {
  try {
    const detail = await adminService.getFamilyDetailData(req.params.familyId);
    if (!detail) return res.status(404).send('Family not found');
    return renderAdmin(req, res, 'pages/admin_family_detail', {
      title: 'Family Detail',
      current: 'families',
      detail
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * getAuditLogs: executes this module action.
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await adminService.getAuditLogsData(req.query || {});
    return renderAdmin(req, res, 'pages/admin_audit_logs', {
      title: 'Admin Audit Logs',
      current: 'audit',
      data
    });
  } catch (error) {
    return next(error);
  }
};
