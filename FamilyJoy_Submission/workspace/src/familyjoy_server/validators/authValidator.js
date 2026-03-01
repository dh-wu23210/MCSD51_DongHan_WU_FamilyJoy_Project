/** Module: authValidator. Handles authValidator responsibilities. */

function validateLogin(body) {
  const username = (body.username || '').trim();
  const password = body.password || '';
  if (!username || !password) return { ok: false, error: 'Username and password are required' };
  return { ok: true, value: { username, password, rememberMe: body.rememberMe } };
}

/**
 * validateRegisterFamily: executes this module action.
 */
function validateRegisterFamily(body) {
  const familyName = (body.familyName || '').trim();
  const familyCode = (body.familyCode || '').trim().toUpperCase();
  const customUsername = (body.username || '').trim();
  const password = body.password || '';
  const confirmPassword = body.confirmPassword || '';

  if (!familyName) return { ok: false, error: 'Family name is required' };
  if (!familyCode || familyCode.length !== 4 || !/^[A-Z0-9]{4}$/.test(familyCode)) {
    return { ok: false, error: 'Family code must be exactly 4 letters or numbers (A-Z, 0-9)' };
  }
  if (!customUsername) return { ok: false, error: 'Username is required' };
  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters' };
  if (password !== confirmPassword) return { ok: false, error: 'Passwords do not match' };

  return { ok: true, value: { familyName, familyCode, customUsername, password } };
}

module.exports = {
  validateLogin,
  validateRegisterFamily
};
