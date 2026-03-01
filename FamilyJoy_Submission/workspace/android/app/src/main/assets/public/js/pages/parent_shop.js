/** Module: parent_shop. Handles parent shop behavior. */

import { setupConfirmDialogs } from '../modules/confirm.js';

const iconClassMap = {
  gift: 'bi-gift',
  book: 'bi-book',
  game: 'bi-controller',
  sports: 'bi-trophy',
  snack: 'bi-cup-straw',
  outdoor: 'bi-tree',
  music: 'bi-music-note-beamed',
  art: 'bi-palette',
  home: 'bi-cake',
  // Legacy compatibility for existing stored icon keys
  pet: 'bi-paw',
  star: 'bi-star'
};

/**
 * setIconPreview: executes this module action.
 */
function setIconPreview(formId, iconKey) {
  const iconClass = iconClassMap[iconKey] || 'bi-gift';
  if (formId === 'createRewardForm') {
    const input = document.getElementById('createIconKey');
    const preview = document.getElementById('createIconPreview');
    if (input) input.value = iconKey;
    if (preview) {
      if (iconKey) {
        preview.innerHTML = `<i class="bi ${iconClass}"></i><span class="small text-muted ms-1">${iconKey}</span>`;
      } else {
        preview.innerHTML = '<span class="small text-muted">No icon selected</span>';
      }
    }
  }
  if (formId === 'editRewardForm') {
    const input = document.getElementById('editRewardIcon');
    const preview = document.getElementById('editIconPreview');
    if (input) input.value = iconKey;
    if (preview) {
      if (iconKey) {
        preview.innerHTML = `<i class="bi ${iconClass}"></i><span class="small text-muted ms-1">${iconKey}</span>`;
      } else {
        preview.innerHTML = '<span class="small text-muted">No icon selected</span>';
      }
    }
  }

  const iconCells = document.querySelectorAll(`.reward-icon-cell[data-icon-form-id="${formId}"]`);
  iconCells.forEach((cell) => {
    const cellIconKey = cell.getAttribute('data-icon-key') || '';
    const selected = cellIconKey === iconKey;
    cell.classList.toggle('is-selected', selected);
    cell.classList.toggle('btn-primary', selected);
    cell.classList.toggle('btn-outline-secondary', !selected);
    cell.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

/**
 * populateEditForm: executes this module action.
 */
function populateEditForm(data) {
  const form = document.getElementById('editRewardForm');
  const nameInput = document.getElementById('editRewardName');
  const descInput = document.getElementById('editRewardDescription');
  const priceInput = document.getElementById('editRewardPrice');

  if (form) form.action = `/shop/reward/edit/${data.id}`;
  if (nameInput) nameInput.value = data.name || '';
  if (descInput) descInput.value = data.description || 'Magic Gift';
  if (priceInput) priceInput.value = data.price || '';
  setIconPreview('editRewardForm', data.iconKey || 'gift');
}

document.addEventListener('DOMContentLoaded', function () {
  setupConfirmDialogs();

  const parentItemModal = document.getElementById('parentShopItemModal');
  const parentItemTitle = document.getElementById('parentShopItemTitle');
  const parentItemDescription = document.getElementById('parentShopItemDescription');
  const parentItemIcon = document.getElementById('parentShopItemIcon');
  const parentItemPrice = document.getElementById('parentShopItemPrice');
  const parentItemStatusWrap = document.getElementById('parentShopItemStatusWrap');
  const parentItemStatus = document.getElementById('parentShopItemStatus');
  const parentItemDeleteForm = document.getElementById('parentShopDeleteForm');
  const parentItemEditFromDetail = document.getElementById('parentShopEditFromDetail');

  let selectedReward = null;
  let openEditAfterDetailClose = false;

  if (parentItemModal) {
    parentItemModal.addEventListener('show.bs.modal', function (event) {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      selectedReward = {
        id: trigger.getAttribute('data-item-id') || '',
        name: trigger.getAttribute('data-item-name') || '',
        description: trigger.getAttribute('data-item-description') || '',
        price: trigger.getAttribute('data-item-price') || '',
        iconKey: trigger.getAttribute('data-item-icon-key') || 'gift',
        iconClass: trigger.getAttribute('data-item-icon-class') || 'bi-gift',
        statusLabel: trigger.getAttribute('data-item-status-label') || '',
        inactive: trigger.getAttribute('data-item-inactive') === '1'
      };

      if (parentItemTitle) parentItemTitle.textContent = selectedReward.name || 'Reward';
      if (parentItemDescription) parentItemDescription.textContent = selectedReward.description || '';
      if (parentItemIcon) parentItemIcon.className = `bi ${selectedReward.iconClass} fs-1`;
      if (parentItemPrice) parentItemPrice.textContent = selectedReward.price || '';

      if (parentItemStatusWrap && parentItemStatus) {
        if (selectedReward.inactive) {
          parentItemStatus.textContent = (selectedReward.statusLabel || 'Inactive').toLowerCase();
          parentItemStatusWrap.classList.remove('d-none');
        } else {
          parentItemStatusWrap.classList.add('d-none');
          parentItemStatus.textContent = '';
        }
      }

      if (parentItemDeleteForm) parentItemDeleteForm.action = `/shop/reward/delete/${selectedReward.id}`;
      openEditAfterDetailClose = false;
    });

    parentItemModal.addEventListener('hidden.bs.modal', function () {
      if (!openEditAfterDetailClose || !selectedReward) return;
      openEditAfterDetailClose = false;
      populateEditForm(selectedReward);
      const editElement = document.getElementById('editRewardModal');
      if (!editElement) return;
      const editModal = bootstrap.Modal.getOrCreateInstance(editElement);
      editModal.show();
    });
  }

  if (parentItemEditFromDetail) {
    parentItemEditFromDetail.addEventListener('click', function () {
      if (!selectedReward) return;
      openEditAfterDetailClose = true;
      const detailModal = bootstrap.Modal.getOrCreateInstance(parentItemModal);
      detailModal.hide();
    });
  }

  const createRewardModal = document.getElementById('createRewardModal');
  if (createRewardModal) {
    createRewardModal.addEventListener('show.bs.modal', function () {
      const createForm = document.getElementById('createRewardForm');
      if (createForm) createForm.reset();
      setIconPreview('createRewardForm', '');
    });
  }

  const createForm = document.getElementById('createRewardForm');
  if (createForm) {
    createForm.addEventListener('submit', function (event) {
      const iconInput = document.getElementById('createIconKey');
      const iconKey = iconInput ? (iconInput.value || '').trim() : '';
      if (!iconKey) {
        event.preventDefault();
        if (typeof window.showToast === 'function') {
          window.showToast('Please select an icon.', 'warning', 2500);
        }
      }
    });
  }

  setIconPreview('createRewardForm', '');
  const editIconInput = document.getElementById('editRewardIcon');
  setIconPreview('editRewardForm', editIconInput ? (editIconInput.value || 'gift') : 'gift');

  const iconCells = document.querySelectorAll('.reward-icon-cell');
  iconCells.forEach((cell) => {
    cell.addEventListener('click', function () {
      const iconKey = cell.getAttribute('data-icon-key') || 'gift';
      const formId = cell.getAttribute('data-icon-form-id') || '';
      if (!formId) return;
      setIconPreview(formId, iconKey);
    });
  });
});

