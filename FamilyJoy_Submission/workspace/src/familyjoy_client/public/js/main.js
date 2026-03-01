/** Module: main. Handles main behavior. */

// main.js
// Entry point: initializes all UI modules
import { setupModalDismissal, showModal } from './modules/modal.js';
import { setupToastAutoDismiss } from './modules/toast.js';
import { setupPasswordChangeConfirm } from './modules/password-confirmation.js';
import { initPageToast } from './modules/flash.js';
import { initMailbox } from './modules/mailbox.js';

/**
 * flushQueuedModals: executes this module action.
 */
function flushQueuedModals() {
  if (!Array.isArray(window.__modalQueue)) return;
  window.__modalQueue.forEach(function (modalConfig) {
    showModal(modalConfig);
  });
  window.__modalQueue.length = 0;
}

document.addEventListener('DOMContentLoaded', function () {
  setupModalDismissal();
  setupToastAutoDismiss();
  setupPasswordChangeConfirm();
  initPageToast();
  flushQueuedModals();
  initMailbox();
});
