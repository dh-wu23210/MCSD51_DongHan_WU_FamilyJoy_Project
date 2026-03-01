/** Module: toast. Handles toast behavior. */

// toast.js
// Handles toast notification system

export function setupToastAutoDismiss() {
  // Bootstrap Toast handles auto-dismiss internally.
}

// Show a toast notification - Universal function
export function showToast(message, type = 'success', duration = 3000) {
  const toastRoot = document.getElementById('toast-root');
  if (!toastRoot) {
    console.warn('Toast root not found');
    return;
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastRoot.appendChild(toastEl);

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    delay: duration,
    autohide: true
  });

  toastEl.addEventListener('hidden.bs.toast', function () {
    toastEl.remove();
  });

  toast.show();
}

// Make showToast available globally
if (typeof window !== 'undefined') {
  window.showToast = showToast;
}
