/** Module: child_shop. Handles child shop behavior. */

import { setupConfirmDialogs } from '../modules/confirm.js';
import { showModal } from '../modules/modal.js';
import { initShopGridViewport } from '../modules/shop-grid.js';

document.addEventListener('DOMContentLoaded', function () {
  setupConfirmDialogs();
  initShopGridViewport();

  const itemModal = document.getElementById('childShopItemModal');
  if (!itemModal) return;

  const titleEl = document.getElementById('childShopItemTitle');
  const iconEl = document.getElementById('childShopItemIcon');
  const descriptionEl = document.getElementById('childShopItemDescription');
  const priceEl = document.getElementById('childShopItemPrice');
  const quantityEl = document.getElementById('childShopItemQuantity');
  const buyForm = document.getElementById('childShopBuyForm');
  const buyButton = document.getElementById('childShopBuyButton');
  const itemModalInstance = bootstrap.Modal.getOrCreateInstance(itemModal);

  itemModal.addEventListener('show.bs.modal', function (event) {
    const trigger = event.relatedTarget;
    if (!trigger) return;

    const itemId = trigger.getAttribute('data-item-id') || '';
    const itemName = trigger.getAttribute('data-item-name') || 'Item';
    const itemDescription = trigger.getAttribute('data-item-description') || '';
    const itemIconClass = trigger.getAttribute('data-item-icon-class') || 'bi-gift';
    const itemPrice = trigger.getAttribute('data-item-price') || '';
    const itemQuantityLabel = trigger.getAttribute('data-item-quantity-label') || '';
    const itemDisabled = trigger.getAttribute('data-item-disabled') === '1';
    const confirmText = trigger.getAttribute('data-item-confirm-text') || 'Buy this reward?';

    if (titleEl) titleEl.textContent = itemName;
    if (descriptionEl) descriptionEl.textContent = itemDescription;
    if (priceEl) priceEl.textContent = String(itemPrice);
    if (quantityEl) quantityEl.textContent = itemQuantityLabel;
    if (iconEl) iconEl.className = `bi ${itemIconClass} fs-1`;
    if (buyForm) buyForm.action = `/shop/buy/${encodeURIComponent(itemId)}`;

    if (buyButton) {
      buyButton.disabled = itemDisabled;
      buyButton.textContent = itemDisabled ? 'Unavailable' : 'Buy';
      buyButton.dataset.confirmBody = confirmText;
    }
  });

  if (buyForm) {
    buyForm.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (!buyButton || buyButton.disabled) return;

      const confirmTitle = 'Confirm Purchase';
      const confirmBody = buyButton.dataset.confirmBody || 'Buy this reward?';
      itemModal.addEventListener('hidden.bs.modal', function handleHidden() {
        var confirmedPurchase = false;
        var confirmModal = showModal({
          id: 'childShopBuyConfirm',
          title: confirmTitle,
          body: confirmBody,
          confirmText: 'Buy',
          cancelText: false,
          onConfirm: function () {
            confirmedPurchase = true;
            buyForm.submit();
          }
        });

        if (confirmModal) {
          confirmModal.addEventListener('hidden.bs.modal', function () {
            if (!confirmedPurchase) {
              itemModalInstance.show();
            }
          }, { once: true });
        }
      }, { once: true });
      itemModalInstance.hide();
    });
  }
});
