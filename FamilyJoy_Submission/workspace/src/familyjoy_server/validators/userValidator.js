/** Module: userValidator. Handles userValidator responsibilities. */

function validateNickname(body) {
  const nickname = (body.nickname || '').trim();
  if (!nickname) return { ok: false, error: 'Nickname is required' };
  if (nickname.length > 50) return { ok: false, error: 'Nickname must be less than 50 characters' };
  return { ok: true, value: { nickname } };
}

/**
 * validateUsername: executes this module action.
 */
function validateUsername(body) {
  const customUsername = (body.customUsername || '').trim();
  if (!customUsername) return { ok: false, error: 'Username is required' };
  if (!/^[a-zA-Z0-9_]+$/.test(customUsername)) {
    return { ok: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { ok: true, value: { customUsername } };
}

/**
 * validateChangePassword: executes this module action.
 */
function validateChangePassword(body) {
  const currentPassword = body.currentPassword || '';
  const password = body.password || '';
  const password2 = body.password2 || '';
  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters' };
  if (password !== password2) return { ok: false, error: 'Passwords do not match' };
  return { ok: true, value: { currentPassword, password } };
}

module.exports = {
  validateNickname,
  validateUsername,
  validateChangePassword
};
