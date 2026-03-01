/** Module: admin_auth. Handles admin auth behavior. */

function isSystemAdminSession(user) {
  if (!user) return false;
  return user.isSystemAdmin === true;
}

/**
 * requireAdminAuth: executes this module action.
 */
function requireAdminAuth(req, res, next) {
  const user = req.session && req.session.adminUser;
  if (!user || !isSystemAdminSession(user)) {
    return res.redirect('/admin_login');
  }
  return next();
}

module.exports = {
  requireAdminAuth,
  isSystemAdminSession
};
