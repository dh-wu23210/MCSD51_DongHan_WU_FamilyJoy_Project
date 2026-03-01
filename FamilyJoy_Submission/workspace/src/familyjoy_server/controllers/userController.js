/** Module: userController. Handles userController responsibilities. */

const userService = require('../services/userService');
const { validateNickname, validateUsername, validateChangePassword } = require('../validators/userValidator');
const { buildProfileViewModel, buildChangePasswordViewModel } = require('../viewModels/userViewModel');
const FALLBACK_ERROR = 'Operation failed';

/**
 * syncInitialPasswordFlagFromDb: executes this module action.
 */
async function syncInitialPasswordFlagFromDb(sessionUser) {
  if (!sessionUser || !sessionUser.id) return false;
  const dbUser = await userService.findById(sessionUser.id);
  if (!dbUser) return false;
  const isInitial =
    dbUser.is_initial_password === 1 ||
    dbUser.is_initial_password === '1' ||
    dbUser.is_initial_password === true;
  sessionUser.isInitialPassword = isInitial;
  return isInitial;
}

/**
 * getProfile: executes this module action.
 */
exports.getProfile = (req, res) => {
  (async () => {
    const user = req.session.user;
    const isInitialPassword = await syncInitialPasswordFlagFromDb(user);
    if (isInitialPassword) {
      const changePassword = buildChangePasswordViewModel({
        user,
        error: ''
      });
      return res.render('pages/profile/profile', buildProfileViewModel({
        user,
        message: '',
        error: '',
        changePassword
      }));
    }

    return res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: req.query.message || '',
      error: req.query.error || ''
    }));
  })().catch((err) => {
    console.error('Get profile error:', err);
    res.redirect('/login');
  });
};

/**
 * getChangePassword: executes this module action.
 */
exports.getChangePassword = (req, res) => {
  (async () => {
    const user = req.session.user;
    await syncInitialPasswordFlagFromDb(user);

    const changePassword = buildChangePasswordViewModel({
      user,
      error: ''
    });
    return res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: '',
      error: '',
      changePassword
    }));
  })().catch((err) => {
    console.error('Get change-password page error:', err);
    res.redirect('/login');
  });
};

/**
 * postUpdateNickname: executes this module action.
 */
exports.postUpdateNickname = async (req, res) => {
  const user = req.session.user;
  const validation = validateNickname(req.body);
  if (!validation.ok) {
    return res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: '',
      error: validation.error
    }));
  }

  try {
    await userService.updateNickname(user.id, validation.value.nickname);
    req.session.user.nickname = validation.value.nickname;
    req.session.save(() => res.redirect('/profile?message=Nickname updated successfully'));
  } catch (err) {
    console.error('Update nickname error:', err);
    res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: '',
      error: err.message || FALLBACK_ERROR
    }));
  }
};

/**
 * postUpdateUsername: executes this module action.
 */
exports.postUpdateUsername = async (req, res) => {
  const user = req.session.user;
  const validation = validateUsername(req.body);
  if (!validation.ok) {
    return res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: '',
      error: validation.error
    }));
  }

  try {
    const result = await userService.updateUsernameWithFamily({
      userId: user.id,
      familyCode: user.familyCode,
      customUsername: validation.value.customUsername
    });
    req.session.user.name = result.username;
    req.session.save(() => {
      res.redirect('/profile?message=Username updated successfully. Please use the new username to login next time.');
    });
  } catch (err) {
    console.error('Update username error:', err);
    const errorMessage = err && err.isUserFacing ? err.message : FALLBACK_ERROR;
    res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: '',
      error: errorMessage
    }));
  }
};

/**
 * postChangePassword: executes this module action.
 */
exports.postChangePassword = async (req, res) => {
  const user = req.session.user;
  const validation = validateChangePassword(req.body);

  /**
   * renderPwdError: executes this module action.
   */
  const renderPwdError = (errMsg) => {
    const changePassword = buildChangePasswordViewModel({
      user,
      error: errMsg
    });
    return res.render('pages/profile/profile', buildProfileViewModel({
      user,
      message: '',
      error: '',
      changePassword
    }));
  };

  if (!validation.ok) {
    return renderPwdError(validation.error);
  }

  try {
    await userService.changePasswordWithPolicy({
      userId: user.id,
      isInitialPassword: user.isInitialPassword,
      currentPassword: validation.value.currentPassword,
      newPassword: validation.value.password
    });

    req.session.destroy(() => res.redirect('/login?message=Password changed successfully. Please log in with your new password.'));
  } catch (err) {
    console.error('Password update error:', err);
    const errorMessage = err && err.isUserFacing ? err.message : FALLBACK_ERROR;
    renderPwdError(errorMessage);
  }
};
