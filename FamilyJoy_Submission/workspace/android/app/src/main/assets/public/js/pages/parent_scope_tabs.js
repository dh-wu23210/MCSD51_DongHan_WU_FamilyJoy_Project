/** Module: parent_scope_tabs. Handles parent scope tabs behavior. */

document.addEventListener('DOMContentLoaded', function () {
  const tabsScrollContainer = document.querySelector('[data-scope-tabs-scroll-container]');
  const tabsScrollLeftBtn = document.querySelector('[data-scope-tabs-scroll="left"]');
  const tabsScrollRightBtn = document.querySelector('[data-scope-tabs-scroll="right"]');
  const tabsStep = 180;

  if (!tabsScrollContainer || !tabsScrollLeftBtn || !tabsScrollRightBtn) return;

  /**
   * ensureActiveTabVisible: executes this module action.
   */
  function ensureActiveTabVisible(behavior = 'smooth') {
    const activeTab = tabsScrollContainer.querySelector('[data-scope-tabs-list] .nav-link.active');
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
    const maxScrollLeft = tabsScrollContainer.scrollWidth - tabsScrollContainer.clientWidth;
    const atStart = tabsScrollContainer.scrollLeft <= 1;
    const atEnd = tabsScrollContainer.scrollLeft >= (maxScrollLeft - 1);
    tabsScrollLeftBtn.disabled = atStart;
    tabsScrollRightBtn.disabled = atEnd || maxScrollLeft <= 0;
  }

  tabsScrollLeftBtn.addEventListener('click', function () {
    tabsScrollContainer.scrollBy({ left: -tabsStep, behavior: 'smooth' });
  });

  tabsScrollRightBtn.addEventListener('click', function () {
    tabsScrollContainer.scrollBy({ left: tabsStep, behavior: 'smooth' });
  });

  tabsScrollContainer.addEventListener('scroll', updateTabsArrowState, { passive: true });

  window.addEventListener('resize', function () {
    updateTabsArrowState();
    ensureActiveTabVisible('auto');
  });

  ensureActiveTabVisible('auto');
  updateTabsArrowState();
});
