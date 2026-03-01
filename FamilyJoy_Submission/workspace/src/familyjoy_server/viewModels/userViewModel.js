/** Module: userViewModel. Handles userViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');

/**
 * splitUsername: executes this module action.
 */
function splitUsername(username) {
  const value = username || '';
  const parts = value.split('_');
  return {
    prefix: parts[0] || '',
    custom: parts.slice(1).join('_') || ''
  };
}

/**
 * buildProfileViewModel: executes this module action.
 */
function buildProfileViewModel(options) {
  const config = options || {};
  const user = config.user || {};
  const parts = splitUsername(user.name || user.username || '');
  const message = config.message || '';
  const error = config.error || '';
  const changePassword = config.changePassword || null;

  return {
    ...buildPageDefaults({
      user,
      current: 'settings',
      message,
      error
    }),
    usernamePrefix: parts.prefix,
    usernameCustom: parts.custom,
    nicknameDisplay: user.nickname || 'NICKNAME',
    nicknameValue: user.nickname || '',
    usernameDisplay: user.name || '',
    usernameCustomValue: parts.custom,
    hasMessage: Boolean(message),
    hasError: Boolean(error),
    roleLabel: user.role || '',
    changePassword,
    showChangePasswordModal: Boolean(changePassword)
  };
}

/**
 * buildChangePasswordViewModel: executes this module action.
 */
function buildChangePasswordViewModel(options) {
  const config = options || {};
  const isForced = !!(config.user && config.user.isInitialPassword);
  const error = config.error || '';
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'settings',
      error
    }),
    isForced,
    hasError: Boolean(error),
    errorMessage: error,
    titleText: isForced ? 'Set New Password' : 'Change Password',
    submitLabel: isForced ? 'Set Password' : 'Change Password',
    showClose: !isForced,
    showCurrentPassword: !isForced,
    showCancel: false,
    isForcedAttr: isForced ? 'true' : 'false'
  };
}

module.exports = {
  buildProfileViewModel,
  buildChangePasswordViewModel
};
