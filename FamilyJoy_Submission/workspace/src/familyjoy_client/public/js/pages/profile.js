/** Module: profile. Handles profile behavior. */

import { showModal } from '../modules/modal.js';

/* Profile page edit handlers for nickname and username */
(function() {
  'use strict';

  /**
   * byId: executes this module action.
   */
  function byId(id) {
    return document.getElementById(id);
  }

  /**
   * toggleSection: executes this module action.
   */
  function toggleSection(displayEl, formEl, showForm) {
    if (!displayEl || !formEl) return;
    if (showForm) {
      displayEl.classList.add('d-none');
      formEl.classList.remove('d-none');
      formEl.classList.add('d-flex');
    } else {
      formEl.classList.add('d-none');
      formEl.classList.remove('d-flex');
      displayEl.classList.remove('d-none');
    }
  }

  /**
   * showAlert: executes this module action.
   */
  function showAlert(container, message, type) {
    if (!container) return;
    container.innerHTML =
      '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
      '</div>';

    setTimeout(function() {
      const alert = container.querySelector('.alert');
      if (!alert) return;
      alert.classList.remove('show');
      setTimeout(function() {
        container.innerHTML = '';
      }, 150);
    }, 5000);
  }

  document.addEventListener('DOMContentLoaded', function() {
    const nicknameDisplay = byId('nicknameDisplay');
    const nicknameForm = byId('nicknameForm');
    const editNicknameBtn = byId('editNicknameBtn');
    const cancelNicknameBtn = byId('cancelNicknameBtn');
    const nicknameInput = byId('nicknameInput');
    const nicknameAlert = byId('nicknameAlert');
    const originalNickname = nicknameInput ? nicknameInput.value : '';

    if (editNicknameBtn) {
      editNicknameBtn.addEventListener('click', function() {
        toggleSection(nicknameDisplay, nicknameForm, true);
        if (nicknameInput) nicknameInput.focus();
      });
    }

    if (cancelNicknameBtn) {
      cancelNicknameBtn.addEventListener('click', function() {
        if (nicknameInput) nicknameInput.value = originalNickname;
        toggleSection(nicknameDisplay, nicknameForm, false);
        if (nicknameAlert) nicknameAlert.innerHTML = '';
      });
    }

    if (nicknameForm) {
      nicknameForm.addEventListener('submit', function(e) {
        const nickname = nicknameInput ? nicknameInput.value.trim() : '';
        if (!nickname) {
          e.preventDefault();
          showAlert(nicknameAlert, 'Nickname is required', 'danger');
          return;
        }
        if (nickname.length > 50) {
          e.preventDefault();
          showAlert(nicknameAlert, 'Nickname must be less than 50 characters', 'danger');
        }
      });
    }

    const usernameDisplay = byId('usernameDisplay');
    const usernameForm = byId('usernameForm');
    const editUsernameBtn = byId('editUsernameBtn');
    const cancelUsernameBtn = byId('cancelUsernameBtn');
    const usernameCustomInput = byId('usernameCustomInput');
    const usernameAlert = byId('usernameAlert');
    const originalCustomUsername = usernameCustomInput ? usernameCustomInput.value : '';

    if (editUsernameBtn) {
      editUsernameBtn.addEventListener('click', function() {
        toggleSection(usernameDisplay, usernameForm, true);
        if (usernameCustomInput) usernameCustomInput.focus();
      });
    }

    if (cancelUsernameBtn) {
      cancelUsernameBtn.addEventListener('click', function() {
        if (usernameCustomInput) usernameCustomInput.value = originalCustomUsername;
        toggleSection(usernameDisplay, usernameForm, false);
        if (usernameAlert) usernameAlert.innerHTML = '';
      });
    }

    if (usernameForm) {
      usernameForm.addEventListener('submit', function(e) {
        const customUsername = usernameCustomInput ? usernameCustomInput.value.trim() : '';

        if (!customUsername) {
          e.preventDefault();
          showAlert(usernameAlert, 'Username is required', 'danger');
          return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(customUsername)) {
          e.preventDefault();
          showAlert(usernameAlert, 'Username can only contain letters, numbers, and underscores', 'danger');
          return;
        }

        e.preventDefault();
        showModal({
          title: 'Confirm Username Change',
          body: 'Are you sure you want to change your username? You will need to use the new username to login.',
          confirmText: 'Confirm',
          cancelText: false,
          onConfirm: function() {
            usernameForm.submit();
          }
        });
      });
    }
  });
})();
