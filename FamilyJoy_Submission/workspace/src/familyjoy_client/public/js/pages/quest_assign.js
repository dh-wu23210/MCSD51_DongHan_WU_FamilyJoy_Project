/** Module: quest_assign. Handles quest assign behavior. */

import { setupConfirmDialogs } from '../modules/confirm.js';

document.addEventListener('DOMContentLoaded', function() {
  setupConfirmDialogs();

  const dayInput = document.getElementById('assignQuestDay');
  const dayLabel = document.getElementById('assignQuestDayLabel');
  const assignModal = document.getElementById('assignQuestModal');
  const categoryButtonsWrap = document.getElementById('assignQuestCategoryButtons');
  const questList = document.getElementById('assignQuestDefinitionList');
  const questInput = document.getElementById('assignQuestDefinition');
  const emptyHint = document.getElementById('assignQuestEmpty');
  const submitButton = document.getElementById('assignQuestSubmit');
  const categoriesDataEl = document.getElementById('assignQuestCategoriesByDay');
  const optionsDataEl = document.getElementById('assignQuestOptionsByDay');
  const tabRow = document.querySelector('[data-active-tab]');
  const todayText = dayLabel?.dataset?.todayText || '';
  const tomorrowText = dayLabel?.dataset?.tomorrowText || '';
  let selectedCategory = '';
  let selectedQuestId = '';
  /**
   * categoriesByDay: executes this module action.
   */
  const categoriesByDay = (() => {
    try {
      return JSON.parse(categoriesDataEl?.textContent || '{}');
    } catch (_error) {
      return {};
    }
  })();
  /**
   * optionsByDay: executes this module action.
   */
  const optionsByDay = (() => {
    try {
      return JSON.parse(optionsDataEl?.textContent || '{}');
    } catch (_error) {
      return {};
    }
  })();

  /**
   * renderQuestPlaceholder: executes this module action.
   */
  function renderQuestPlaceholder(text) {
    if (!questList) return;
    questList.innerHTML = '';
    const node = document.createElement('div');
    node.className = 'list-group-item text-muted small';
    node.textContent = text;
    questList.appendChild(node);
  }

  /**
   * setSubmitState: executes this module action.
   */
  function setSubmitState() {
    if (!submitButton || !questInput) return;
    const canSubmit = Boolean(questInput.value);
    submitButton.disabled = !canSubmit;
    submitButton.classList.toggle('btn-primary', canSubmit);
    submitButton.classList.toggle('btn-secondary', !canSubmit);
  }

  /**
   * setDay: executes this module action.
   */
  function setDay(day) {
    if (!dayInput || !dayLabel) return;
    const normalized = day === 'tomorrow' ? 'tomorrow' : 'today';
    dayInput.value = normalized;
    dayLabel.textContent = normalized === 'tomorrow' ? tomorrowText : todayText;
  }

  /**
   * setSelectedQuest: executes this module action.
   */
  function setSelectedQuest(questId) {
    selectedQuestId = questId || '';
    if (questInput) questInput.value = selectedQuestId;
    if (questList) {
      questList.querySelectorAll('[data-quest-option-id]').forEach((button) => {
        const isActive = button.getAttribute('data-quest-option-id') === selectedQuestId;
        button.classList.toggle('active', isActive);
      });
    }
    setSubmitState();
  }

  /**
   * renderQuestOptions: executes this module action.
   */
  function renderQuestOptions() {
    if (!questList || !dayInput) return;
    const day = dayInput.value || 'today';
    const dayOptions = Array.isArray(optionsByDay[day]) ? optionsByDay[day] : [];
    const filtered = selectedCategory
      ? dayOptions.filter((option) => option.category === selectedCategory)
      : [];

    questList.innerHTML = '';

    if (!selectedCategory) {
      renderQuestPlaceholder('Please select a quest category.');
      if (emptyHint) emptyHint.classList.add('d-none');
      setSelectedQuest('');
      setSubmitState();
      return;
    }

    if (!filtered.length) {
      renderQuestPlaceholder('No quests available in this category.');
      if (emptyHint) emptyHint.classList.add('d-none');
      setSelectedQuest('');
      setSubmitState();
      return;
    }

    if (emptyHint) emptyHint.classList.add('d-none');

    filtered.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-start';
      button.setAttribute('data-quest-option-id', String(option.id));

      const left = document.createElement('div');
      left.className = 'text-start min-w-0';

      const name = document.createElement('div');
      name.className = 'fw-semibold text-truncate';
      name.textContent = option.name;

      const meta = document.createElement('div');
      meta.className = 'small text-muted';
      meta.textContent = option.category;

      const right = document.createElement('div');
      right.className = 'small text-muted d-flex align-items-center gap-1 flex-shrink-0 ms-2';
      const crystalIcon = document.createElement('i');
      crystalIcon.className = 'bi bi-gem fj-crystal-icon';
      const value = document.createElement('span');
      value.textContent = String(option.baseCrystals || 0);
      right.appendChild(crystalIcon);
      right.appendChild(value);

      left.appendChild(name);
      left.appendChild(meta);
      button.appendChild(left);
      button.appendChild(right);
      button.addEventListener('click', () => {
        setSelectedQuest(String(option.id));
      });
      questList.appendChild(button);
    });

    setSelectedQuest('');
    setSubmitState();
  }

  /**
   * renderCategoryOptions: executes this module action.
   */
  function renderCategoryOptions() {
    if (!categoryButtonsWrap || !dayInput) return;
    const day = dayInput.value || 'today';
    const dayCategories = Array.isArray(categoriesByDay[day]) ? categoriesByDay[day] : [];
    categoryButtonsWrap.innerHTML = '';
    selectedCategory = '';

    if (!dayCategories.length) {
      const empty = document.createElement('div');
      empty.className = 'small text-muted';
      empty.textContent = 'No categories available.';
      categoryButtonsWrap.appendChild(empty);
      renderQuestOptions();
      return;
    }

    dayCategories.forEach((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-sm btn-outline-secondary w-100 assign-quest-category-btn';
      button.textContent = category.label;
      button.setAttribute('data-category-value', category.value);
      button.addEventListener('click', () => {
        selectedCategory = category.value;
        categoryButtonsWrap.querySelectorAll('[data-category-value]').forEach((node) => {
          const isCurrent = node.getAttribute('data-category-value') === selectedCategory;
          node.classList.toggle('btn-primary', isCurrent);
          node.classList.toggle('btn-outline-secondary', !isCurrent);
        });
        renderQuestOptions();
      });
      categoryButtonsWrap.appendChild(button);
    });

    renderQuestOptions();
  }

  /**
   * refreshAssignModal: executes this module action.
   */
  function refreshAssignModal(day) {
    setDay(day);
    renderCategoryOptions();
  }

  if (dayLabel && !dayLabel.dataset.todayText) {
    const todayFallback = dayLabel.textContent || '';
    const tomorrowFallback = dayLabel.textContent || '';
    dayLabel.dataset.todayText = todayFallback;
    dayLabel.dataset.tomorrowText = tomorrowFallback;
  }

  document.querySelectorAll('[data-day]').forEach((button) => {
    button.addEventListener('shown.bs.tab', () => {
      refreshAssignModal(button.getAttribute('data-day'));
    });
  });

  if (tabRow && tabRow.dataset.activeTab) {
    refreshAssignModal(tabRow.dataset.activeTab);
  }

  document.querySelectorAll('[data-assign-day]').forEach((button) => {
    button.addEventListener('click', () => {
      refreshAssignModal(button.getAttribute('data-assign-day'));
    });
  });

  if (assignModal) {
    assignModal.addEventListener('show.bs.modal', (event) => {
      const targetDay = event.relatedTarget?.getAttribute('data-assign-day') || dayInput?.value || 'today';
      refreshAssignModal(targetDay);
    });
  }
});
