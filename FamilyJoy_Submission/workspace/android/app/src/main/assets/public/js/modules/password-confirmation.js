/** Module: password-confirmation. Handles password-confirmation behavior. */

// password.js - Simple password change confirmation
import { showModal } from './modal.js';

export function setupPasswordChangeConfirm() {
  const pwForm = document.getElementById('changePasswordForm');
  if (!pwForm) return;
  const isForced = pwForm.dataset.isForced === 'true';

  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');

  pwForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const password = passwordInput?.value || '';
    const confirmPassword = confirmPasswordInput?.value || '';

    if (password !== confirmPassword) {
      const alert = pwForm.querySelector('.alert-danger') || document.createElement('div');
      alert.className = 'alert alert-danger';
      alert.textContent = 'Passwords do not match.';
      if (!pwForm.querySelector('.alert-danger')) {
        pwForm.insertBefore(alert, pwForm.firstChild);
      }
      return;
    }

    // Show confirmation modal
    const title = isForced ? 'Set New Password' : 'Confirm Password Change';
    const body = isForced
      ? 'Set your new password to continue.'
      : 'Are you sure you want to change your password? You will be logged out after changing.';

    showModal({
      title: title,
      body: body,
      confirmText: isForced ? 'Set Password' : 'Confirm',
      cancelText: false,
      dialogClass: 'modal-dialog-centered',
      onConfirm: () => pwForm.submit()
    });
  });
}

