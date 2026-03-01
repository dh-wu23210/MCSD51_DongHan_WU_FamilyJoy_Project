/** Module: auth. Handles auth responsibilities. */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public auth routes (no requireAuth on purpose)
// Redirect root to login page
router.get('/', (req, res) => {
  // If already logged in, redirect to dashboard
  if (req.session.user) {
    const role = (req.session.user.role || '').toLowerCase();
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register-family', authController.getRegisterFamily);
router.post('/register-family', authController.postRegisterFamily);
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;
