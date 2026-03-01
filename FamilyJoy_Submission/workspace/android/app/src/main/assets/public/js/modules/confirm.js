/** Module: confirm. Handles confirm behavior. */

import { showModal } from './modal.js';

export function setupConfirmDialogs(options) {
  const config = options || {};
  const root = config.root || document;
  const boundFlag = '__fjConfirmDialogsBound';
  if (root[boundFlag]) return;
  root[boundFlag] = true;
  const selector = config.selector || '[data-confirm]';
  const defaultTitle = config.title || 'Confirm';
  const bypassFlag = 'confirmBypassOnce';

  root.addEventListener('submit', function(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.dataset[bypassFlag] === '1') {
      delete form.dataset[bypassFlag];
      return;
    }

    const submitter = event.submitter;
    let message = '';
    let title = defaultTitle;
    let confirmText = 'Confirm';

    if (submitter && submitter.matches(selector)) {
      message = submitter.dataset.confirm || '';
      title = submitter.dataset.confirmTitle || title;
      confirmText = submitter.dataset.confirmText || confirmText;
    } else if (form.matches(selector)) {
      message = form.dataset.confirm || '';
      title = form.dataset.confirmTitle || title;
      confirmText = form.dataset.confirmText || confirmText;
    }

    if (!message) return;

    event.preventDefault();
    showModal({
      title: title,
      body: message,
      confirmText: confirmText,
      cancelText: false,
      onConfirm: function() {
        form.dataset[bypassFlag] = '1';
        if (submitter && typeof form.requestSubmit === 'function') {
          form.requestSubmit(submitter);
          return;
        }
        form.submit();
      }
    });
  });
}
