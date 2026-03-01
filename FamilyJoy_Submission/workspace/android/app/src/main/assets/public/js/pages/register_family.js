/** Module: register_family. Handles register family behavior. */

document.addEventListener('DOMContentLoaded', function () {
  const familyCodeInput = document.getElementById('familyCodeInput');
  const usernamePrefix = document.getElementById('usernamePrefix');
  const usernameInput = document.getElementById('usernameInput');
  const fullUsernamePreview = document.getElementById('fullUsernamePreview');
  const previewUsername = document.getElementById('previewUsername');
  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const passwordMatch = document.getElementById('passwordMatch');

  /**
   * normalizeFamilyCode: executes this module action.
   */
  function normalizeFamilyCode() {
    if (!familyCodeInput) return 'CODE';
    const raw = String(familyCodeInput.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    familyCodeInput.value = raw.slice(0, 4);
    return familyCodeInput.value || 'CODE';
  }

  /**
   * updateUsernamePreview: executes this module action.
   */
  function updateUsernamePreview() {
    const code = normalizeFamilyCode();
    const userPart = usernameInput ? (usernameInput.value || 'username') : 'username';
    if (usernamePrefix) usernamePrefix.textContent = `${code}_`;
    if (fullUsernamePreview) fullUsernamePreview.textContent = `${code}_${userPart}`;
    if (previewUsername) previewUsername.textContent = `${code}_${userPart}`;
  }

  /**
   * updatePasswordMatch: executes this module action.
   */
  function updatePasswordMatch() {
    if (!passwordInput || !confirmPasswordInput || !passwordMatch) return;
    const pwd = passwordInput.value;
    const confirm = confirmPasswordInput.value;

    if (!confirm) {
      passwordMatch.textContent = 'Please Re-enter Your Password.';
      passwordMatch.className = 'form-text text-muted';
      return;
    }

    if (pwd === confirm) {
      passwordMatch.textContent = 'Password Match.';
      passwordMatch.className = 'form-text text-success';
      return;
    }

    passwordMatch.textContent = 'Password Does Not Match.';
    passwordMatch.className = 'form-text text-danger';
  }

  if (familyCodeInput) {
    familyCodeInput.addEventListener('input', updateUsernamePreview);
  }
  if (usernameInput) {
    usernameInput.addEventListener('input', updateUsernamePreview);
  }
  if (passwordInput) {
    passwordInput.addEventListener('input', updatePasswordMatch);
  }
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', updatePasswordMatch);
  }

  updateUsernamePreview();
  updatePasswordMatch();
});

