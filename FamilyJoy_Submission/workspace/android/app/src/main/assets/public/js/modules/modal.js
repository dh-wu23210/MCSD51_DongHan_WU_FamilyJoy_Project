/** Module: modal. Handles modal behavior. */

// modal.js
// Handles modal (dialog) creation using Bootstrap Modal component

export function showModal(options) {
  var config = options || {};
  var id = config.id || 'fjModal_' + Date.now();
  var openModalCount = document.querySelectorAll('.modal.show').length;
  var rootStyles = window.getComputedStyle(document.documentElement);
  var modalBase = parseInt(rootStyles.getPropertyValue('--z-layer-modal-base').trim(), 10);
  var backdropBase = parseInt(rootStyles.getPropertyValue('--z-layer-backdrop-base').trim(), 10);
  var modalStep = parseInt(rootStyles.getPropertyValue('--z-layer-modal-step').trim(), 10);
  if (!Number.isFinite(modalBase)) modalBase = 0;
  if (!Number.isFinite(backdropBase)) backdropBase = 0;
  if (!Number.isFinite(modalStep) || modalStep <= 0) modalStep = 1;
  var modalZIndex = modalBase + (openModalCount * modalStep);
  var backdropZIndex = openModalCount > 0
    ? (modalZIndex - 1)
    : (backdropBase + (openModalCount * modalStep));
  var title = config.title || '';
  var body = config.body || '';
  var confirmText = typeof config.confirmText === 'string' ? config.confirmText : 'OK';
  var cancelText = typeof config.cancelText === 'string' ? config.cancelText : '';
  var hideCancel = config.cancelText === false || config.hideCancel || !cancelText;
  var hideConfirm = config.confirmText === false || config.hideConfirm;
  var dialogClass = typeof config.dialogClass === 'string' ? config.dialogClass : '';
  var footerButtons = '';

  if (!hideCancel) {
    footerButtons += `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="modal-cancel-${id}">${cancelText}</button>`;
  }
  if (!hideConfirm) {
    footerButtons += `<button type="button" class="btn btn-primary" id="modal-confirm-${id}">${confirmText}</button>`;
  }
  var footerHtml = footerButtons ? `<div class="modal-footer">${footerButtons}</div>` : '';

  // Remove existing modal with same id
  var existing = document.getElementById(id);
  if (existing) {
    var existingModal = bootstrap.Modal.getInstance(existing);
    if (existingModal) existingModal.dispose();
    existing.remove();
  }

  // Create Bootstrap Modal HTML
  var modalHtml = `
    <div class="modal fade app-device-modal" id="${id}" tabindex="-1" role="dialog">
      <div class="modal-dialog ${dialogClass}" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${body}
          </div>
          ${footerHtml}
        </div>
      </div>
    </div>
  `;

  // Append modal to modal-root or body
  var root = document.getElementById('modal-root') || document.body;
  root.insertAdjacentHTML('beforeend', modalHtml);

  var modalElement = document.getElementById(id);
  modalElement.style.setProperty('z-index', String(modalZIndex), 'important');
  var bsModal = new bootstrap.Modal(modalElement);

  modalElement.addEventListener('shown.bs.modal', function() {
    var backdrops = document.querySelectorAll('.modal-backdrop');
    var latestBackdrop = backdrops[backdrops.length - 1];
    if (latestBackdrop) {
      latestBackdrop.style.setProperty('z-index', String(backdropZIndex), 'important');
    }
  });

  // Bind cancel button
  var cancelBtn = document.getElementById('modal-cancel-' + id);
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      if (typeof config.onCancel === 'function') config.onCancel();
      bsModal.hide();
    });
  }

  // Bind confirm button
  var okBtn = document.getElementById('modal-confirm-' + id);
  if (okBtn) {
    okBtn.addEventListener('click', function() {
      if (typeof config.onConfirm === 'function') config.onConfirm();
      bsModal.hide();
    });
  }

  // Remove modal from DOM after it's hidden
  modalElement.addEventListener('hidden.bs.modal', function() {
    this.remove();
  });

  // Show modal
  bsModal.show();

  return modalElement;
}

export function showErrorModal(message, title) {
  return showModal({
    id: 'fjErrorModal',
    title: title || 'Error',
    body: message,
    confirmText: 'OK',
    cancelText: false
  });
}

export function createConfirmModal(id, title, body, onConfirm) {
  return showModal({
    id: id,
    title: title,
    body: body,
    confirmText: 'Confirm',
    cancelText: false,
    onConfirm: onConfirm
  });
}

export function setupModalDismissal() {
  // Bootstrap Modal handles dismissal automatically with data-bs-dismiss
  // This function is kept for backward compatibility
  document.addEventListener('click', function(e) {
    var t = e.target;
    if (t && (t.tagName === 'BUTTON' || t.tagName === 'A') && /^close|cancel/i.test(t.id || '')) {
      var modal = t.closest('.modal');
      if (modal) {
        var bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
      }
    }
  });
}

