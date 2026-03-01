/** Module: parent_dashboard. Handles parent dashboard behavior. */

import { showErrorModal, createConfirmModal, showModal } from '../modules/modal.js';
import { WISH_SLOT_ORDER, WISH_LEAF_LAYOUT_BY_CODE, WISH_DOCK_LAYOUT_BY_CODE } from '../modules/wish_cloud_layout.js';


/**
 * buildWishMap: executes this module action.
 */
function buildWishMap(rawMap) {
  const map = {};
  Object.keys(rawMap || {}).forEach((childId) => {
    map[String(childId)] = Array.isArray(rawMap[childId]) ? rawMap[childId] : [];
  });
  return map;
}

/**
 * renderWishGrid: executes this module action.
 */
function renderWishGrid(grid, wishes, selectedId) {
  if (!grid) return;

  const map = {};
  (wishes || []).forEach((wish) => { map[wish.slot_code] = wish; });
  grid.innerHTML = '';
  const isLeafLayout = grid.classList.contains('fj-wish-leaf-layer');
  const dockGapPx = 8;
  const slotCount = WISH_SLOT_ORDER.length || 5;

  WISH_SLOT_ORDER.forEach((slot, index) => {
    const cell = document.createElement(isLeafLayout ? 'button' : 'div');
    if (isLeafLayout) cell.type = 'button';
    const wish = map[slot];
    cell.className = (isLeafLayout ? 'fj-wish-leaf-slot' : 'fj-wish-slot')
      + (wish ? ' filled' : '')
      + (isLeafLayout ? (wish ? ' is-floating' : ' is-docked') : '')
      + (wish && wish.id === selectedId ? ' selected' : '');
    cell.dataset.slot = slot;
    if (wish) cell.dataset.wishId = String(wish.id);
    if (isLeafLayout) {
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
    }

    const icon = document.createElement('div');
    if (wish) {
      icon.className = 'fj-wish-seed';
      icon.innerHTML = '';
    } else {
      icon.className = 'fj-wish-leaf';
      icon.innerHTML = '';
    }

    cell.appendChild(icon);
    grid.appendChild(cell);
  });
}

/**
 * renderWishStorage: executes this module action.
 */
function renderWishStorage(grid, wishes, selectedId) {
  if (!grid) return;

  const map = {};
  (wishes || []).forEach((wish) => { map[wish.slot_code] = wish; });
  grid.innerHTML = '';

  WISH_SLOT_ORDER.forEach((slot) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    const wish = map[slot];
    cell.className = 'fj-wish-storage-slot' + (wish ? ' filled' : '') + (wish && wish.id === selectedId ? ' selected' : '');
    cell.dataset.slot = slot;
    if (wish) {
      cell.dataset.wishId = String(wish.id);
      cell.disabled = false;
      cell.removeAttribute('aria-disabled');
    } else {
      cell.disabled = false;
      cell.removeAttribute('aria-disabled');
    }

    const icon = document.createElement('div');
    if (wish) {
      icon.className = 'fj-wish-slot-icon';
      icon.innerHTML = `<i class="bi ${wish.iconClass || 'bi-gift'}"></i>`;
    } else {
      icon.className = 'fj-wish-slot-empty';
      icon.innerHTML = '<i class="bi bi-plus"></i>';
    }

    cell.appendChild(icon);
    grid.appendChild(cell);
  });
}

/**
 * acceptWish: executes this module action.
 */
async function acceptWish(wishId) {
  const response = await fetch(`/wishes/${encodeURIComponent(wishId)}/accept`, { method: 'POST' });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Failed to accept wish');
  }
}

/**
 * refreshWishesForChild: executes this module action.
 */
async function refreshWishesForChild(childId, wishMap) {
  const response = await fetch(`/wishes/child/${encodeURIComponent(childId)}`);
  if (!response.ok) return;
  const payload = await response.json().catch(() => ({}));
  wishMap[String(childId)] = Array.isArray(payload.wishes) ? payload.wishes : [];
}

document.addEventListener('DOMContentLoaded', function () {
  const children = Array.isArray(window.__children) ? window.__children : [];
  const wishMap = buildWishMap(window.__wishMap);
  let selected = { childId: null, wishId: null };
  let carouselResetting = false;

  /**
   * getChildLabel: executes this module action.
   */
  function getChildLabel(childId) {
    const found = children.find((child) => String(child.id) === String(childId));
    return found ? (found.nickname || found.username || 'Child') : 'Child';
  }

  /**
   * getWishesForChild: executes this module action.
   */
  function getWishesForChild(childId) {
    return wishMap[String(childId)] || [];
  }

  /**
   * renderAllVisibleGrids: executes this module action.
   */
  function renderAllVisibleGrids() {
    const leafGrids = document.querySelectorAll('.fj-wish-leaf-layer');
    leafGrids.forEach((grid) => {
      const childId = String(grid.dataset.childId || '');
      const selectedId = selected.childId === childId ? selected.wishId : null;
      renderWishGrid(grid, getWishesForChild(childId), selectedId);
    });

    const storageGrids = document.querySelectorAll('.fj-wish-storage-layer');
    storageGrids.forEach((grid) => {
      const childId = String(grid.dataset.childId || '');
      const selectedId = selected.childId === childId ? selected.wishId : null;
      renderWishStorage(grid, getWishesForChild(childId), selectedId);
    });
  }

  /**
   * initLoopingCarousel: executes this module action.
   */
  function initLoopingCarousel() {
    const track = document.getElementById('allChildrenSpiritList');
    if (!track) return null;

    const originalCards = Array.from(track.children).filter((el) => el.classList.contains('fj-child-spirit-card'));
    /**
     * updateProgressIndicator: executes this module action.
     */
    const updateProgressIndicator = (displayIndex, total) => {
      const ratio = total <= 0 ? 0 : ((displayIndex - 0.5) / total);
      document.querySelectorAll('.all-children-progress-bar').forEach((el) => {
        el.style.setProperty('--progress-ratio', String(Math.max(0, Math.min(1, ratio))));
        el.setAttribute('aria-label', `Child ${displayIndex} of ${total}`);
      });
    };

    if (originalCards.length < 2) {
      updateProgressIndicator(1, originalCards.length || 1);
      return {
        goPrev: function () {},
        goNext: function () {}
      };
    }

    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[originalCards.length - 1].cloneNode(true);
    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone = 'last';

    track.insertBefore(lastClone, track.firstChild);
    track.appendChild(firstClone);

    const getStep = () => track.clientWidth;
    let touchStartX = null;
    let touchBaseIndex = null;
    let dragging = false;

    /**
     * getNearestIndex: executes this module action.
     */
    const getNearestIndex = () => {
      const step = getStep();
      return Math.round(track.scrollLeft / step);
    };

    /**
     * toRealDisplayIndex: executes this module action.
     */
    const toRealDisplayIndex = (trackIndex) => {
      if (trackIndex <= 0) return originalCards.length;
      if (trackIndex >= originalCards.length + 1) return 1;
      return trackIndex;
    };

    /**
     * updateProgressText: executes this module action.
     */
    const updateProgressText = () => {
      const displayIndex = toRealDisplayIndex(getNearestIndex());
      updateProgressIndicator(displayIndex, originalCards.length);
    };

    /**
     * moveToIndex: executes this module action.
     */
    const moveToIndex = (index, behavior = 'smooth') => {
      const step = getStep();
      track.scrollTo({ left: index * step, behavior });
    };
    /**
     * jumpTo: executes this module action.
     */
    const jumpTo = (value) => {
      carouselResetting = true;
      track.scrollTo({ left: value, behavior: 'auto' });
      requestAnimationFrame(() => {
        carouselResetting = false;
        updateProgressText();
      });
    };

    jumpTo(getStep());
    renderAllVisibleGrids();
    updateProgressText();

    let settleTimer = null;
    /**
     * settle: executes this module action.
     */
    const settle = () => {
      if (carouselResetting) return;
      const step = getStep();
      const max = track.scrollWidth - track.clientWidth;
      const threshold = Math.max(8, Math.floor(step * 0.08));

      if (track.scrollLeft <= threshold) {
        // At prepended clone, jump to the real last card.
        jumpTo(step * originalCards.length);
        return;
      }
      if (track.scrollLeft >= (max - threshold)) {
        // At appended clone, jump to the real first card.
        jumpTo(step);
        return;
      }
      updateProgressText();
    };

    track.addEventListener('scroll', () => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 120);
    }, { passive: true });

    track.addEventListener('touchstart', (event) => {
      if (!event.touches || !event.touches.length) return;
      touchStartX = event.touches[0].clientX;
      touchBaseIndex = getNearestIndex();
      dragging = true;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!dragging || touchStartX === null || touchBaseIndex === null) {
        dragging = false;
        touchStartX = null;
        touchBaseIndex = null;
        return;
      }

      const step = getStep();
      const currentIndex = getNearestIndex();
      // Force single-card transition: clamp destination to base +/- 1.
      const minIndex = touchBaseIndex - 1;
      const maxIndex = touchBaseIndex + 1;
      const targetIndex = Math.max(minIndex, Math.min(maxIndex, currentIndex));

      moveToIndex(targetIndex, 'smooth');
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 220);

      dragging = false;
      touchStartX = null;
      touchBaseIndex = null;
    }, { passive: true });

    return {
      goPrev: function () {
        const current = getNearestIndex();
        moveToIndex(current - 1, 'smooth');
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 220);
      },
      goNext: function () {
        const current = getNearestIndex();
        moveToIndex(current + 1, 'smooth');
        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 220);
      }
    };
  }

  /**
   * openWishDetailModal: executes this module action.
   */
  function openWishDetailModal(wish, childId) {
    if (!wish) return;
    const childLabel = getChildLabel(childId);
    showModal({
      id: 'parentWishDetailModal',
      title: `Wish Detail: ${childLabel}`,
      body: `
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi ${wish.iconClass} text-primary"></i>
          <div class="fw-semibold">${wish.name}</div>
        </div>
        <div class="small text-muted">${wish.description || 'No description.'}</div>
      `,
      confirmText: 'Accept',
      onConfirm: function () {
        createConfirmModal('acceptWishConfirm', 'Accept Wish', 'Accept this wish?', async function () {
          try {
            await acceptWish(wish.id);
            await refreshWishesForChild(childId, wishMap);
            selected = { childId: null, wishId: null };
            renderAllVisibleGrids();
          } catch (error) {
            showErrorModal(error.message || 'Failed to accept wish', 'Wish');
          }
        });
      }
    });
  }

  renderAllVisibleGrids();
  const carouselController = initLoopingCarousel();

  document.addEventListener('click', function (event) {
    const navButton = event.target.closest('.all-children-nav-btn, .all-children-side-nav');
    if (navButton) {
      const action = navButton.dataset.action;
      if (action === 'prev') {
        carouselController?.goPrev();
      } else if (action === 'next') {
        carouselController?.goNext();
      }
      return;
    }

    const cell = event.target.closest('.fj-wish-leaf-layer .fj-wish-leaf-slot, .fj-wish-storage-layer .fj-wish-storage-slot');
    if (!cell) return;

    const grid = cell.closest('.fj-wish-leaf-layer, .fj-wish-storage-layer');
    if (!grid) return;
    const isStorage = Boolean(grid.classList.contains('fj-wish-storage-layer'));

    const childId = String(grid.dataset.childId || '');
    const wishId = cell.dataset.wishId;
    if (!wishId) {
      selected = { childId: null, wishId: null };
      renderAllVisibleGrids();
      return;
    }

    selected = { childId, wishId };
    renderAllVisibleGrids();

    const wish = getWishesForChild(childId).find((item) => String(item.id) === String(wishId));
    openWishDetailModal(wish, childId);
  });
});
