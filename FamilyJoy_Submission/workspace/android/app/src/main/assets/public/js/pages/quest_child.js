/** Module: quest_child. Handles quest child behavior. */

import { showModal } from '/js/modules/modal.js';

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('submit', function(event) {
    const form = event.target;
    if (!form || !form.classList || !form.classList.contains('js-submit-quest')) {
      return;
    }

    event.preventDefault();

    const title = form.getAttribute('data-confirm-title') || 'Confirm';
    const body = form.getAttribute('data-confirm-body') || 'Are you sure?';

    showModal({
      title,
      body,
      confirmText: 'Submit',
      cancelText: false,
      onConfirm: () => form.submit()
    });
  });
});
