/** Module: auth. Handles auth responsibilities. */

const userRepo = require('../repositories/userRepo');
const userService = require('../services/userService');

// Require authentication
function requireAuth(req, res, next) {
  if (!(req.session && req.session.user)) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  if (!userId) {
    req.session.destroy(() => res.redirect('/'));
    return;
  }

  userRepo.getStatusRoleAdminById(userId)
    .then((row) => {
      if (!row) {
        req.session.destroy(() => res.redirect('/'));
        return;
      }

      if (row.status !== 'active') {
        req.session.destroy(() => res.redirect('/login?error=Account has been disabled.'));
        return;
      }

      req.session.user.role = userService.normalizeRole(row.role);
      req.session.user.isAdmin = row.is_admin === 1 || row.is_admin === '1' || row.is_admin === true;
      req.session.user.crystalBalance = typeof row.crystal_balance === 'number' ? row.crystal_balance : 0;
      req.session.user.isInitialPassword =
        row.is_initial_password === 1 || row.is_initial_password === '1' || row.is_initial_password === true;
      next();
    })
    .catch(() => {
      req.session.destroy(() => res.redirect('/'));
    });
}

// Require password change for initial password users
function requirePasswordChange(req, res, next) {
  // Allow access to change-password flow and logout
  if (req.path === '/profile/change-password' || req.path === '/logout') {
    return next();
  }

  const sessionUser = req.session && req.session.user;
  if (!sessionUser || !sessionUser.id) {
    return next();
  }

  userRepo.findById(sessionUser.id)
    .then((dbUser) => {
      if (!dbUser) return next();
      const isInitialPassword =
        dbUser.is_initial_password === 1 ||
        dbUser.is_initial_password === '1' ||
        dbUser.is_initial_password === true;

      sessionUser.isInitialPassword = isInitialPassword;
      if (isInitialPassword) {
        return res.redirect('/profile/change-password');
      }
      return next();
    })
    .catch(() => next());
}

/**
 * requireRole: executes this module action.
 */
function requireRole(roles) {
  return (req, res, next) => {
    const user = req.session && req.session.user;
    if (!user || !user.role) {
      return res.redirect('/login');
    }

    if (!roles.includes(user.role)) {
      return res.status(403).send('Forbidden');
    }

    next();
  };
}

/**
 * requireAdmin: executes this module action.
 */
function requireAdmin(req, res, next) {
  const user = req.session && req.session.user;
  if (!user || !user.isAdmin) {
    return res.status(403).send('Forbidden');
  }
  next();
}

module.exports = requireAuth;
module.exports.requireAuth = requireAuth;
module.exports.requirePasswordChange = requirePasswordChange;
module.exports.requireRole = requireRole;
module.exports.requireAdmin = requireAdmin;
