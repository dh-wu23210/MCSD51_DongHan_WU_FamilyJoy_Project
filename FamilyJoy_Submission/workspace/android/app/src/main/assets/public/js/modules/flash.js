/** Module: flash. Handles flash behavior. */

import { showToast } from './toast.js';

export function initPageToast() {
  const toastEl = document.getElementById('page-toast');
  if (!toastEl) return;

  const message = toastEl.dataset.message || '';
  const error = toastEl.dataset.error || '';

  if (message) {
    showToast(message, 'success', 3000);
  }
  if (error) {
    showToast(error, 'danger', 4000);
  }
}
