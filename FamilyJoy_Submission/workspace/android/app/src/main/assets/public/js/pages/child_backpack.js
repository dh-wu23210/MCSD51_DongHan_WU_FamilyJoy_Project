/** Module: child_backpack. Handles child backpack behavior. */

function createBackpackCell(item, selectedRewardId) {
  const cell = document.createElement('div');

  if (!item) {
    cell.className = 'fj-backpack-item empty';
    return cell;
  }

  cell.className = 'fj-backpack-item' + (selectedRewardId === item.reward_id ? ' selected' : '');
  cell.dataset.rewardId = item.reward_id;

  const iconWrap = document.createElement('div');
  iconWrap.className = 'fj-backpack-icon';
  const icon = document.createElement('i');
  icon.className = `bi ${item.iconClass}`;
  iconWrap.appendChild(icon);
  cell.appendChild(iconWrap);

  if (item.quantity > 0) {
    const qty = document.createElement('div');
    qty.className = 'fj-backpack-qty';
    qty.textContent = `x${item.quantity}`;
    cell.appendChild(qty);
  }

  return cell;
}

/**
 * renderBackpackGrid: executes this module action.
 */
function renderBackpackGrid(items, selectedRewardId) {
  const grid = document.getElementById('backpackGrid');
  if (!grid) return;

  const list = Array.isArray(items) ? items : [];
  const minSlots = 18;
  const totalSlots = Math.max(minSlots, list.length);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalSlots; i += 1) {
    fragment.appendChild(createBackpackCell(list[i], selectedRewardId));
  }

  grid.replaceChildren(fragment);
}

/**
 * renderBackpackDetail: executes this module action.
 */
function renderBackpackDetail(item) {
  const detailEmpty = document.getElementById('backpackDetailEmpty');
  const detailContent = document.getElementById('backpackDetailContent');
  const detailIcon = document.getElementById('backpackDetailIcon');
  const detailName = document.getElementById('backpackDetailName');
  const detailDescription = document.getElementById('backpackDetailDescription');
  const detailQuantity = document.getElementById('backpackDetailQuantity');
  const detailWishButton = document.getElementById('backpackWishButton');

  if (!detailEmpty || !detailContent || !detailIcon || !detailName || !detailDescription || !detailQuantity || !detailWishButton) return;

  if (!item) {
    detailEmpty.classList.remove('d-none');
    detailContent.classList.add('d-none');
    detailWishButton.disabled = true;
    return;
  }

  detailEmpty.classList.add('d-none');
  detailContent.classList.remove('d-none');

  detailIcon.className = `bi ${item.iconClass || 'bi-gift'}`;
  detailName.textContent = item.name || 'Reward';
  detailDescription.textContent = item.description || 'No Description';
  detailQuantity.textContent = `Quantity: x${item.quantity || 0}`;
  detailWishButton.disabled = !item.quantity || item.quantity <= 0;
}

document.addEventListener('DOMContentLoaded', function () {
  const backpackItems = Array.isArray(window.__backpackItems) ? window.__backpackItems : [];
  let selectedRewardId = null;

  /**
   * getItemByRewardId: executes this module action.
   */
  function getItemByRewardId(rewardId) {
    return backpackItems.find((item) => String(item.reward_id) === String(rewardId)) || null;
  }

  /**
   * refresh: executes this module action.
   */
  function refresh() {
    renderBackpackGrid(backpackItems, selectedRewardId);
    renderBackpackDetail(getItemByRewardId(selectedRewardId));
  }

  refresh();

  const backpackGrid = document.getElementById('backpackGrid');
  const backpackGridScroll = document.querySelector('.fj-backpack-grid-scroll');
  const backpackWishButton = document.getElementById('backpackWishButton');
  if (backpackGrid) {
    backpackGrid.addEventListener('click', function (event) {
      const cell = event.target.closest('.fj-backpack-item');
      if (!cell) return;
      const rewardId = cell.dataset.rewardId;
      if (!rewardId) {
        selectedRewardId = null;
        refresh();
        return;
      }

      selectedRewardId = selectedRewardId === rewardId ? null : rewardId;
      refresh();
    });
  }

  if (backpackGridScroll) {
    backpackGridScroll.addEventListener('click', function (event) {
      const inCell = event.target.closest('.fj-backpack-item');
      if (inCell) return;
      if (selectedRewardId !== null) {
        selectedRewardId = null;
        refresh();
      }
    });
  }

  /**
   * makeWish: executes this module action.
   */
  async function makeWish() {
    const item = getItemByRewardId(selectedRewardId);
    if (!item) return;
    const rewardId = item.reward_id;
    if (!rewardId) return;

    try {
      if (backpackWishButton) backpackWishButton.disabled = true;
      const response = await fetch('/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: rewardId })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error || 'Failed to make wish');
      }

      const target = getItemByRewardId(rewardId);
      if (target) {
        target.quantity = Math.max(0, Number(target.quantity || 0) - 1);
      }
      for (let i = backpackItems.length - 1; i >= 0; i -= 1) {
        if (Number(backpackItems[i].quantity || 0) <= 0) {
          backpackItems.splice(i, 1);
        }
      }
      selectedRewardId = null;
      refresh();
      if (typeof window.showToast === 'function') {
        window.showToast('Wish created.', 'success', 2500);
      }
    } catch (error) {
      if (typeof window.showToast === 'function') {
        window.showToast(error.message || 'Failed to make wish.', 'danger', 3000);
      }
    } finally {
      if (backpackWishButton) backpackWishButton.disabled = false;
    }
  }

  if (backpackWishButton) {
    backpackWishButton.addEventListener('click', function () {
      makeWish();
    });
  }
});
