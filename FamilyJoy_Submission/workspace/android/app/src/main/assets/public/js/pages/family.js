/** Module: family. Handles family behavior. */

import { setupConfirmDialogs } from '../modules/confirm.js';

document.addEventListener('DOMContentLoaded', function() {
  setupConfirmDialogs();

  const addMemberModal = document.getElementById('addMemberModal');
  if (addMemberModal && addMemberModal.dataset.open === '1') {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(addMemberModal);
    modalInstance.show();
  }

  const roleInput = document.getElementById('roleInput');
  const roleButtons = document.querySelectorAll('[data-role-option]');
  if (roleInput && roleButtons.length) {
    /**
     * updateRoleButtons: executes this module action.
     */
    const updateRoleButtons = (selectedRole) => {
      roleButtons.forEach((button) => {
        const value = button.getAttribute('data-role-option') || '';
        const isSelected = value === selectedRole;
        button.classList.toggle('btn-primary', isSelected);
        button.classList.toggle('btn-outline-secondary', !isSelected);
        button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
    };

    updateRoleButtons(roleInput.value || 'child');

    roleButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const value = button.getAttribute('data-role-option');
        if (!value) return;
        roleInput.value = value;
        updateRoleButtons(value);
      });
    });
  }
});
