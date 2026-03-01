/** Module: admin_routes. Handles admin routes behavior. */

const express = require('express');
const adminController = require('../controllers/admin_controller');
const { requireAdminAuth } = require('../middleware/admin_auth');

const router = express.Router();

router.get('/admin/login', (_req, res) => res.redirect('/admin_login'));
router.post('/admin/login', (_req, res) => res.redirect(307, '/admin_login'));
router.get('/admin_login', adminController.getLogin);
router.post('/admin_login', adminController.postLogin);
router.post('/admin_logout', adminController.postLogout);
router.post('/admin/logout', (_req, res) => res.redirect(307, '/admin_logout'));

router.get('/admin', requireAdminAuth, adminController.getDashboard);
router.get('/admin/users', requireAdminAuth, adminController.getUsers);
router.get('/admin/families', requireAdminAuth, adminController.getFamilies);
router.get('/admin/families/:familyId', requireAdminAuth, adminController.getFamilyDetail);
router.get('/admin/audit-logs', requireAdminAuth, adminController.getAuditLogs);

module.exports = router;
