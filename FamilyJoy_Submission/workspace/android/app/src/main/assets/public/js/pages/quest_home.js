/** Module: quest_home. Handles quest home behavior. */

import { setupConfirmDialogs } from '../modules/confirm.js';

document.addEventListener('DOMContentLoaded', function() {
  setupConfirmDialogs();

  const tabsScrollContainer = document.querySelector('[data-quest-tabs-scroll-container]');
  const tabsScrollLeftBtn = document.querySelector('[data-quest-tabs-scroll="left"]');
  const tabsScrollRightBtn = document.querySelector('[data-quest-tabs-scroll="right"]');
  const tabsStep = 180;

  /**
   * ensureActiveTabVisible: executes this module action.
   */
  function ensureActiveTabVisible(behavior = 'smooth') {
    if (!tabsScrollContainer) return;
    const activeTab = tabsScrollContainer.querySelector('.quest-parent-tabs-list .nav-link.active');
    if (!activeTab) return;

    const containerRect = tabsScrollContainer.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const pad = 8;

    if (tabRect.left < containerRect.left + pad) {
      const delta = (containerRect.left + pad) - tabRect.left;
      tabsScrollContainer.scrollBy({ left: -delta, behavior });
    } else if (tabRect.right > containerRect.right - pad) {
      const delta = tabRect.right - (containerRect.right - pad);
      tabsScrollContainer.scrollBy({ left: delta, behavior });
    }
  }

  /**
   * updateTabsArrowState: executes this module action.
   */
  function updateTabsArrowState() {
    if (!tabsScrollContainer || !tabsScrollLeftBtn || !tabsScrollRightBtn) return;
    const maxScrollLeft = tabsScrollContainer.scrollWidth - tabsScrollContainer.clientWidth;
    const atStart = tabsScrollContainer.scrollLeft <= 1;
    const atEnd = tabsScrollContainer.scrollLeft >= (maxScrollLeft - 1);
    tabsScrollLeftBtn.disabled = atStart;
    tabsScrollRightBtn.disabled = atEnd || maxScrollLeft <= 0;
  }

  if (tabsScrollContainer && tabsScrollLeftBtn && tabsScrollRightBtn) {
    tabsScrollLeftBtn.addEventListener('click', function() {
      tabsScrollContainer.scrollBy({ left: -tabsStep, behavior: 'smooth' });
    });
    tabsScrollRightBtn.addEventListener('click', function() {
      tabsScrollContainer.scrollBy({ left: tabsStep, behavior: 'smooth' });
    });
    tabsScrollContainer.addEventListener('scroll', updateTabsArrowState, { passive: true });
    window.addEventListener('resize', function() {
      updateTabsArrowState();
      ensureActiveTabVisible('auto');
    });
    ensureActiveTabVisible('auto');
    updateTabsArrowState();
  }

  const createModal = document.getElementById('allChildrenCreateQuestModal');
  const editModal = document.getElementById('allChildrenEditQuestModal');
  const questBookCategories = document.querySelectorAll('[data-quest-book-category]');
  if (!createModal && !editModal && !questBookCategories.length) return;

  /**
   * collapseQuestBookPanel: executes this module action.
   */
  function collapseQuestBookPanel(toggleButton, panel) {
    if (!toggleButton || !panel) return;
    panel.classList.add('d-none');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-label', 'Expand category quests');
    const icon = toggleButton.querySelector('i');
    if (icon) icon.className = 'bi bi-chevron-down';
  }

  /**
   * openQuestBookPanel: executes this module action.
   */
  function openQuestBookPanel(toggleButton, panel) {
    if (!toggleButton || !panel) return;
    panel.classList.remove('d-none');
    toggleButton.setAttribute('aria-expanded', 'true');
    toggleButton.setAttribute('aria-label', 'Collapse category quests');
    const icon = toggleButton.querySelector('i');
    if (icon) icon.className = 'bi bi-chevron-up';
  }

  if (questBookCategories.length) {
    let autoOpenDone = false;
    const params = new URLSearchParams(window.location.search);
    const openCategory = (params.get('openCategory') || '').trim().toLowerCase();

    questBookCategories.forEach((category) => {
      const toggleButton = category.querySelector('[data-quest-book-toggle]');
      if (!toggleButton) return;
      const panelId = toggleButton.getAttribute('data-quest-book-toggle');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      collapseQuestBookPanel(toggleButton, panel);
      toggleButton.addEventListener('click', function() {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

        questBookCategories.forEach((otherCategory) => {
          const otherToggle = otherCategory.querySelector('[data-quest-book-toggle]');
          if (!otherToggle) return;
          const otherPanelId = otherToggle.getAttribute('data-quest-book-toggle');
          const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
          if (!otherPanel) return;
          collapseQuestBookPanel(otherToggle, otherPanel);
        });

        if (!isExpanded) openQuestBookPanel(toggleButton, panel);
      });

      if (!autoOpenDone && openCategory) {
        const categoryKey = (category.getAttribute('data-quest-book-category-key') || '').trim().toLowerCase();
        if (categoryKey === openCategory) {
          openQuestBookPanel(toggleButton, panel);
          autoOpenDone = true;
        }
      }
    });
  }

  const categoryInput = document.getElementById('allChildrenCreateQuestCategory');
  const categoryLabel = document.getElementById('allChildrenCreateQuestCategoryLabel');

  /**
   * setCategory: executes this module action.
   */
  function setCategory(category) {
    const value = category || '';
    if (categoryInput) categoryInput.value = value;
    if (categoryLabel) {
      categoryLabel.textContent = value || '-';
      categoryLabel.classList.toggle('text-muted', !value);
    }
  }

  if (createModal) {
    createModal.addEventListener('show.bs.modal', function(event) {
      const trigger = event.relatedTarget;
      const category = trigger && trigger.getAttribute
        ? (trigger.getAttribute('data-create-category') || '')
        : '';
      setCategory(category);
    });
  }

  if (editModal) {
    editModal.addEventListener('show.bs.modal', function(event) {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const id = trigger.getAttribute('data-id') || '';
      const name = trigger.getAttribute('data-name') || '';
      const description = trigger.getAttribute('data-description') || '';
      const category = trigger.getAttribute('data-category') || '';
      const baseCrystals = trigger.getAttribute('data-base-crystals') || '0';

      const form = document.getElementById('allChildrenEditQuestForm');
      const deleteBtn = document.getElementById('allChildrenDeleteQuestBtn');
      const nameInput = document.getElementById('allChildrenEditQuestName');
      const descInput = document.getElementById('allChildrenEditQuestDescription');
      const categoryInputEdit = document.getElementById('allChildrenEditQuestCategory');
      const categoryLabelEdit = document.getElementById('allChildrenEditQuestCategoryLabel');
      const baseCrystalsInput = document.getElementById('allChildrenEditQuestBaseCrystals');

      if (form) form.action = `/quest/book/edit/${id}`;
      if (deleteBtn) deleteBtn.setAttribute('formaction', `/quest/book/delete/${id}`);
      if (nameInput) nameInput.value = name;
      if (descInput) descInput.value = description;
      if (categoryInputEdit) categoryInputEdit.value = category;
      if (categoryLabelEdit) {
        categoryLabelEdit.textContent = category || '-';
        categoryLabelEdit.classList.toggle('text-muted', !category);
      }
      if (baseCrystalsInput) baseCrystalsInput.value = baseCrystals;
    });
  }
});
