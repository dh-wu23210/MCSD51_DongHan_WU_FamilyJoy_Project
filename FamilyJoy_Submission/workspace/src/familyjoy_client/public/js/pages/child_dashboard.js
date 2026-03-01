/** Module: child_dashboard. Handles child dashboard behavior. */

import { showModal } from '../modules/modal.js';
import { WISH_SLOT_ORDER, WISH_LEAF_LAYOUT_BY_CODE, WISH_DOCK_LAYOUT_BY_CODE } from '../modules/wish_cloud_layout.js';


/**
 * buildWishMap: executes this module action.
 */
function buildWishMap(wishes) {
  const map = {};
  (wishes || []).forEach((wish) => {
    map[wish.slot_code] = wish;
  });
  return map;
}

/**
 * renderWishGrid: executes this module action.
 */
function renderWishGrid(grid, wishes, selectedId) {
  if (!grid) return;
  const map = buildWishMap(wishes);
  grid.innerHTML = '';
  const dockGapPx = 8;
  const slotCount = WISH_SLOT_ORDER.length || 5;

  WISH_SLOT_ORDER.forEach((slot, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    const wish = map[slot];
    cell.className = 'fj-wish-leaf-slot' + (wish ? ' filled is-floating' : ' is-docked') + (wish && wish.id === selectedId ? ' selected' : '');
    cell.dataset.slot = slot;
    const layout = wish
      ? (WISH_LEAF_LAYOUT_BY_CODE[slot] || { left: 12, bottom: 18, rotate: 0, scale: 1, z: 1, delay: 0 })
      : (WISH_DOCK_LAYOUT_BY_CODE[slot] || { left: 10, bottom: 46, rotate: 0, scale: 1, z: 1, delay: 0 });
    const bottomUnit = wish ? '%' : 'px';
    const dockCenterFormula = `calc((((100% - ${(slotCount - 1) * dockGapPx}px) / ${slotCount}) * ${index}) + (${dockGapPx}px * ${index}) + ((100% - ${(slotCount - 1) * dockGapPx}px) / ${slotCount} / 2))`;
    cell.style.setProperty('--slot-top', layout.top != null ? `${layout.top}%` : 'auto');
    cell.style.setProperty('--slot-right', layout.right != null ? `${layout.right}%` : 'auto');
    cell.style.setProperty('--slot-bottom', layout.bottom != null ? `${layout.bottom}${bottomUnit}` : 'auto');
    cell.style.setProperty('--slot-left', wish ? (layout.left != null ? `${layout.left}%` : 'auto') : dockCenterFormula);
    cell.style.setProperty('--slot-rotate', `${layout.rotate}deg`);
    cell.style.setProperty('--slot-scale', String(wish ? 1 : (layout.scale || 1)));
    cell.style.setProperty('--slot-z', String(layout.z || 1));
    cell.style.setProperty('--slot-delay', `${layout.delay || 0}s`);
    cell.setAttribute('aria-label', wish ? `Wish ${wish.name}` : 'Empty wish boat');

    if (wish) {
      cell.dataset.wishId = String(wish.id);
      cell.innerHTML = '<span class="fj-wish-seed" aria-hidden="true"></span>';
    } else {
      cell.innerHTML = '<span class="fj-wish-leaf" aria-hidden="true"></span>';
    }
    grid.appendChild(cell);
  });
}

/**
 * renderWishStorage: executes this module action.
 */
function renderWishStorage(grid, wishes, selectedId) {
  if (!grid) return;
  const map = buildWishMap(wishes);
  grid.innerHTML = '';

  WISH_SLOT_ORDER.forEach((slot) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    const wish = map[slot];
    cell.className = 'fj-wish-storage-slot' + (wish ? ' filled' : '') + (wish && wish.id === selectedId ? ' selected' : '');
    cell.dataset.slot = slot;
    cell.setAttribute('aria-label', wish ? `Wish ${wish.name}` : 'Empty wish slot');

    if (wish) {
      cell.dataset.wishId = String(wish.id);
      cell.innerHTML = `<div class="fj-wish-slot-icon"><i class="bi ${wish.iconClass || 'bi-gift'}"></i></div>`;
      cell.disabled = false;
      cell.removeAttribute('aria-disabled');
    } else {
      cell.innerHTML = '<div class="fj-wish-slot-empty"><i class="bi bi-plus"></i></div>';
      cell.disabled = false;
      cell.removeAttribute('aria-disabled');
    }
    grid.appendChild(cell);
  });
}

/**
 * openWishDetail: executes this module action.
 */
function openWishDetail(wish) {
  if (!wish) return;
  showModal({
    id: 'childWishDetailModal',
    title: 'Wish Detail',
    body: `
      <div class="d-flex align-items-center gap-2 mb-2">
        <i class="bi ${wish.iconClass} text-primary"></i>
        <div class="fw-semibold">${wish.name}</div>
      </div>
      <div class="small text-muted">${wish.description || 'No description.'}</div>
    `,
    hideConfirm: true
  });
}

/**
 * openEmptyWishModal: executes this module action.
 */
function openEmptyWishModal() {
  showModal({
    id: 'childEmptyWishModal',
    title: 'Wish Slot',
    body: '<div class="small text-muted">No wish has been planted yet. Go to Backpack to use a wish item.</div>',
    confirmText: 'Go To Backpack',
    onConfirm: function () {
      window.location.href = '/backpack';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let wishes = Array.isArray(window.__wishes) ? window.__wishes : [];
  let selectedWishId = null;
  const wishLeafLayer = document.getElementById('wishLeafLayer');
  const wishStorageLayer = document.getElementById('wishStorageLayer');

  /**
   * refresh: executes this module action.
   */
  function refresh() {
    renderWishGrid(wishLeafLayer, wishes, selectedWishId);
    renderWishStorage(wishStorageLayer, wishes, selectedWishId);
  }

  /**
   * getWishById: executes this module action.
   */
  function getWishById(id) {
    return wishes.find((wish) => String(wish.id) === String(id));
  }

  refresh();

  document.addEventListener('click', function (event) {
    const cell = event.target.closest('.fj-wish-leaf-layer .fj-wish-leaf-slot, .fj-wish-storage-layer .fj-wish-storage-slot');
    if (!cell) return;
    const isStorage = Boolean(cell.closest('.fj-wish-storage-layer'));
    const wishId = cell.dataset.wishId;
    if (!wishId) {
      if (isStorage) openEmptyWishModal();
      return;
    }
    selectedWishId = wishId;
    openWishDetail(getWishById(wishId));
    refresh();
  });
});
