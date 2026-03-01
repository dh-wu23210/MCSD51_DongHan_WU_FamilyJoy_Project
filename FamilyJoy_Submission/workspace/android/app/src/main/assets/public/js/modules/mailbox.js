/** Module: mailbox. Handles mailbox behavior. */

import { showModal, showErrorModal } from './modal.js';

/**
 * escapeHtml: executes this module action.
 */
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * formatMailboxTime: executes this module action.
 */
function formatMailboxTime(value) {
  if (!value) return '';
  var date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

/**
 * buildMailboxBody: executes this module action.
 */
function buildMailboxBody(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return '<p class="text-muted mb-0">No mailbox messages yet.</p>';
  }
  var items = messages.map(function (item) {
    var statusBadge = item.is_read
      ? ''
      : '<span class="badge text-bg-primary ms-2">NEW</span>';
    return `
      <div class="list-group-item rounded" data-mailbox-item="1" data-mailbox-id="${escapeHtml(item.id)}" data-mailbox-read="${item.is_read ? '1' : '0'}">
        <div class="d-flex align-items-center justify-content-between gap-2">
          <div class="fw-semibold">${escapeHtml(item.title)}</div>
          ${statusBadge}
        </div>
        <div class="text-muted small">${escapeHtml(item.message)}</div>
        <div class="text-muted small">${escapeHtml(formatMailboxTime(item.created_at))}</div>
      </div>
    `;
  }).join('');
  return `
    <div class="mailbox-list-wrap">
      <div class="list-group d-grid gap-1 touch-scroll mailbox-list-fixed" data-mailbox-scroll>
        ${items}
      </div>
    </div>
  `;
}

/**
 * updateMailboxBadge: executes this module action.
 */
function updateMailboxBadge(count) {
  var badge = document.getElementById('header-mail-count');
  var button = document.querySelector('[data-mailbox-button]');
  var icon = button ? button.querySelector('i') : null;
  if (!badge) return;
  var numericCount = Number(count) || 0;
  if (numericCount > 0) {
    badge.classList.remove('d-none');
    if (button) button.classList.add('has-unread');
    if (icon) {
      icon.classList.remove('bi-envelope');
      icon.classList.add('bi-envelope-fill');
    }
  } else {
    badge.classList.add('d-none');
    if (button) button.classList.remove('has-unread');
    if (icon) {
      icon.classList.remove('bi-envelope-fill');
      icon.classList.add('bi-envelope');
    }
  }
}

/**
 * bindMailboxItemClicks: executes this module action.
 */
function bindMailboxItemClicks(modalElement) {
  if (!modalElement) return;
  modalElement.addEventListener('click', async function (event) {
    var target = event.target;
    var item = target.closest && target.closest('[data-mailbox-item]');
    if (!item) return;
    if (item.getAttribute('data-mailbox-read') === '1') return;

    var mailboxId = item.getAttribute('data-mailbox-id');
    if (!mailboxId) return;

    try {
      var response = await fetch('/mailbox/mark-read/' + encodeURIComponent(mailboxId), { method: 'POST' });
      if (!response.ok) return;
      var payload = await response.json();
      item.setAttribute('data-mailbox-read', '1');
      var status = item.querySelector('.badge');
      if (status) status.remove();
      if (payload && typeof payload.unreadCount === 'number') {
        updateMailboxBadge(payload.unreadCount);
      } else {
        await setupMailboxBadge();
      }
    } catch (err) {
      // Ignore failures silently
    }
  });
}

/**
 * setupMailboxBadge: executes this module action.
 */
async function setupMailboxBadge() {
  var badge = document.getElementById('header-mail-count');
  if (!badge) return;
  try {
    var response = await fetch('/mailbox/summary', { headers: { 'Accept': 'application/json' } });
    if (!response.ok) return;
    var payload = await response.json();
    updateMailboxBadge(payload ? payload.unreadCount : 0);
  } catch (err) {
    badge.classList.add('d-none');
  }
}

/**
 * setupMailboxModal: executes this module action.
 */
function setupMailboxModal() {
  var button = document.querySelector('[data-mailbox-button]');
  if (!button) return;

  button.addEventListener('click', async function (event) {
    event.preventDefault();
    try {
      var response = await fetch('/mailbox/data', { headers: { 'Accept': 'application/json' } });
      if (!response.ok) {
        throw new Error('Failed to load mailbox');
      }
      var payload = await response.json();
      var body = buildMailboxBody(payload.messages || []);
      var unreadCount = Array.isArray(payload.messages)
        ? payload.messages.filter(function (m) { return !m.is_read; }).length
        : 0;
      updateMailboxBadge(unreadCount);
      var modalElement = showModal({
        id: 'fjMailboxModal',
        title: 'Mailbox',
        body: body,
        hideConfirm: true,
        dialogClass: 'modal-dialog-centered'
      });
      bindMailboxItemClicks(modalElement);
    } catch (err) {
      showErrorModal('Unable to load mailbox. Please try again.', 'Mailbox');
    }
  });
}

export function initMailbox() {
  setupMailboxModal();
  setupMailboxBadge();
}
