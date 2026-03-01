/** Module: authController. Handles authController responsibilities. */

const authService = require('../services/authService');
const analyticsService = require('../services/analyticsService');
const { validateLogin, validateRegisterFamily } = require('../validators/authValidator');
const { buildLoginViewModel } = require('../viewModels/authViewModel');
const { buildRegisterFamilyViewModel } = require('../viewModels/registrationViewModel');
const FALLBACK_ERROR = 'Operation failed';

/**
 * buildRegisterFormValues: executes this module action.
 */
function buildRegisterFormValues(body) {
  const source = body || {};
  return {
    familyName: (source.familyName || '').trim(),
    familyCode: String(source.familyCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4),
    username: (source.username || '').trim()
  };
}

/**
 * getLogin: executes this module action.
 */
exports.getLogin = (req, res) => {
  // If already logged in, redirect based on role
  if (req.session.user) {
    const role = (req.session.user.role || '').toLowerCase();
    return res.redirect('/dashboard');
  }
  
  // Get success message from query string (e.g., after password change)
  res.render('pages/auth/login', buildLoginViewModel({
    message: req.query.message || '',
    error: ''
  }));
};

/**
 * postLogin: executes this module action.
 */
exports.postLogin = (req, res) => {
  const { ok, error, value } = validateLogin(req.body);
  if (!ok) {
    return res.render('pages/auth/login', buildLoginViewModel({
      attemptedUsername: (req.body.username || '').trim(),
      error
    }));
  }

  const rememberMe = value.rememberMe === 'on' || value.rememberMe === 'true';

  authService.login(value.username, value.password)
    .then((result) => {
      /**
       * redirectAfterLogin: executes this module action.
       */
      const redirectAfterLogin = () => {
        if (result.sessionUser.isInitialPassword) {
          return res.redirect('/profile/change-password');
        }
        return res.redirect('/dashboard');
      };

      req.session.regenerate((regenErr) => {
        if (regenErr) {
          console.error('Session regenerate error:', regenErr);
          return res.render('pages/auth/login', buildLoginViewModel({
            attemptedUsername: value.username,
            error: FALLBACK_ERROR
          }));
        }

        if (rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else {
          req.session.cookie.maxAge = null;
        }

        req.session.user = result.sessionUser;
        req.session.showLoginSuccess = true;

        req.session.save(async (saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return redirectAfterLogin();
          }

          try {
            await authService.syncSessionUserId(req.sessionID, result.sessionUser.id);
            await analyticsService.recordUserLogin({
              userId: result.sessionUser.id,
              familyId: result.sessionUser.familyId
            });
          } catch (sessErr) {
            console.error('Session sync/login event error:', sessErr);
          }
          redirectAfterLogin();
        });
      });
    })
    .catch((err) => {
      if (err && err.isUserFacing) {
        console.warn(`Login rejected for username "${value.username}": ${err.message}`);
      } else {
        console.error('Login error:', err);
      }
      res.render('pages/auth/login', buildLoginViewModel({
        attemptedUsername: value.username,
        error: err.message || FALLBACK_ERROR
      }));
    });
};

/**
 * logout: executes this module action.
 */
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

// Create Family - one-click creation (no form required)
exports.getRegisterFamily = (req, res) => {
  res.render('pages/auth/register_family', buildRegisterFamilyViewModel({
    error: '',
    formValues: buildRegisterFormValues()
  }));
};

/**
 * postRegisterFamily: executes this module action.
 */
exports.postRegisterFamily = async (req, res) => {
  try {
    const validation = validateRegisterFamily(req.body);
    if (!validation.ok) {
      return res.render('pages/auth/register_family', buildRegisterFamilyViewModel({
        error: validation.error,
        formValues: buildRegisterFormValues(req.body)
      }));
    }

    const result = await authService.createFamily(validation.value);

    req.session.regenerate((regenErr) => {
        if (regenErr) {
          console.error('Session regenerate error:', regenErr);
          return res.render('pages/auth/register_family', buildRegisterFamilyViewModel({
            error: FALLBACK_ERROR,
            formValues: buildRegisterFormValues(req.body)
          }));
        }

      req.session.user = result.user;
      req.session.save(async (saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.render('pages/auth/register_family', buildRegisterFamilyViewModel({
            error: FALLBACK_ERROR,
            formValues: buildRegisterFormValues(req.body)
          }));
        }
        try {
          await authService.syncSessionUserId(req.sessionID, result.user.id);
        } catch (sessErr) {
          console.error('Session user_id update error:', sessErr);
        }
        res.redirect('/dashboard');
      });
    });
  } catch (error) {
    console.error('Error creating family:', error);
    res.render('pages/auth/register_family', buildRegisterFamilyViewModel({
      error: error.message || FALLBACK_ERROR,
      formValues: buildRegisterFormValues(req.body)
    }));
  }
};
