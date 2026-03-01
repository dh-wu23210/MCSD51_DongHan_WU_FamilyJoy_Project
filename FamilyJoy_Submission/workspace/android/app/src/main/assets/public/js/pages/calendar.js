/** Module: calendar. Handles calendar behavior. */

function buildTaskList(tasks) {
  if (!tasks || tasks.length === 0) {
    return `<div class="list-group">
      <div class="list-group-item text-muted small calendar-empty-item">No quests for this date.</div>
    </div>`;
  }

  const statusPriority = {
    complete: 0,
    submitted: 1,
    assigned: 2,
    incomplete: 3
  };

  const sortedTasks = tasks.slice().sort((a, b) => {
    const aKey = String(a && a.status ? a.status : '').toLowerCase();
    const bKey = String(b && b.status ? b.status : '').toLowerCase();
    const aRank = Object.prototype.hasOwnProperty.call(statusPriority, aKey) ? statusPriority[aKey] : 99;
    const bRank = Object.prototype.hasOwnProperty.call(statusPriority, bKey) ? statusPriority[bKey] : 99;
    if (aRank !== bRank) return aRank - bRank;

    const aName = String(a && a.name ? a.name : '');
    const bName = String(b && b.name ? b.name : '');
    return aName.localeCompare(bName, 'en', { sensitivity: 'base' });
  });

  const items = sortedTasks.map((t) => {
    const totalCrystals = Number(t.crystals || 0);
    const gainedCrystals = t.status === 'complete' ? totalCrystals : 0;
    const statusKey = String(t.status || '').toLowerCase();
    const statusLabelMap = {
      assigned: 'Assigned',
      submitted: 'Submitted',
      incomplete: 'Incomplete',
      complete: 'Complete'
    };
    const statusClassMap = {
      assigned: 'fj-calendar-status-badge fj-calendar-status-assigned',
      submitted: 'fj-calendar-status-badge fj-calendar-status-submitted',
      incomplete: 'fj-calendar-status-badge fj-calendar-status-incomplete',
      complete: 'fj-calendar-status-badge fj-calendar-status-complete'
    };
    const statusLabel = statusLabelMap[statusKey] || (t.status || '');
    const statusClass = statusClassMap[statusKey] || 'fj-calendar-status-badge fj-calendar-status-incomplete';

    return `<div class="list-group-item d-flex justify-content-between align-items-start">
      <div>
        <div class="d-flex align-items-center gap-2">
          <span class="${statusClass}">${statusLabel}</span>
          <div class="fw-semibold">${t.name}</div>
        </div>
      </div>
      <div class="fj-quest-crystal-meta">
        <span class="text-muted small fj-quest-crystal-value">${gainedCrystals}/${totalCrystals}</span>
        <i class="bi bi-gem fj-crystal-icon fj-quest-crystal-icon" aria-hidden="true"></i>
      </div>
    </div>`;
  }).join('');

  return `<div class="list-group">${items}</div>`;
}

/**
 * buildGroupedTaskList: executes this module action.
 */
function buildGroupedTaskList(children, detail) {
  if (!children || children.length === 0) {
    return '<p class="text-muted">No quests for this date.</p>';
  }

  return children.map((child) => {
    const stats = detail.byChild[child.id] || { total: 0, complete: 0, tasks: [] };
    const rate = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
    const panelId = `calendar-child-panel-${child.id}`;

    return `<div class="calendar-child-item mb-2" data-calendar-item="1">
      <div class="calendar-child-shell">
        <div class="calendar-child-main">
          <div class="calendar-child-item-row d-flex align-items-center">
            <div class="d-flex align-items-center gap-2 min-w-0">
              <div class="fw-semibold">${child.name}</div>
              <div class="text-muted small">Completion: ${rate}%</div>
            </div>
          </div>
          <div id="${panelId}" class="calendar-child-item-panel d-none mt-2">
            ${buildTaskList(stats.tasks)}
          </div>
        </div>
        <div class="calendar-child-controls">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center justify-content-center calendar-expand-btn"
            style="width:1.75rem;height:1.75rem;padding:0;"
            data-calendar-expand="${panelId}"
            aria-expanded="false"
            aria-label="Expand ${child.name} quest list">
            <i class="bi bi-chevron-down"></i>
        </button>
          <div class="calendar-child-rail-track d-none" aria-hidden="true"></div>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center justify-content-center d-none calendar-collapse-btn"
            style="width:1.75rem;height:1.75rem;padding:0;"
            data-calendar-collapse="${panelId}"
            aria-label="Collapse ${child.name} quest list"
            disabled>
            <i class="bi bi-chevron-up"></i>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/**
 * buildSingleChildDetail: executes this module action.
 */
function buildSingleChildDetail(stats) {
  return buildTaskList(stats.tasks);
}

/**
 * resolveFamilyCompletionRate: executes this module action.
 */
function resolveFamilyCompletionRate(detail) {
  const info = detail || { byChild: {} };
  const isParent = window.__calendarIsParent;
  if (isParent) {
    const children = window.__calendarChildren || [];
    const divisor = children.length;
    if (!divisor) return 0;
    const sumRates = children.reduce((sum, child) => {
      const stats = info.byChild && info.byChild[child.id]
        ? info.byChild[child.id]
        : { total: 0, complete: 0 };
      const rate = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
      return sum + rate;
    }, 0);
    return Math.round(sumRates / divisor);
  }

  const userId = window.__calendarUserId;
  const stats = info.byChild && info.byChild[userId]
    ? info.byChild[userId]
    : { total: 0, complete: 0 };
  return stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
}

/**
 * renderFamilyCompletion: executes this module action.
 */
function renderFamilyCompletion(detail) {
  const wrap = document.getElementById('calendarFamilyCompletionWrap');
  const bar = document.getElementById('calendarFamilyCompletionBar');
  const text = document.getElementById('calendarFamilyCompletionText');
  if (!wrap || !bar || !text) return;

  const rate = resolveFamilyCompletionRate(detail);
  bar.style.width = `${rate}%`;
  text.textContent = `${rate}%`;
  bar.setAttribute('aria-valuenow', String(rate));
  bar.classList.remove('bg-secondary', 'bg-warning', 'bg-primary', 'bg-success');
  if (rate >= 100) {
    bar.classList.add('bg-success');
  } else if (rate >= 50) {
    bar.classList.add('bg-primary');
  } else if (rate > 0) {
    bar.classList.add('bg-warning');
  } else {
    bar.classList.add('bg-secondary');
  }
}

/**
 * renderDetail: executes this module action.
 */
function renderDetail(date, activeChildId) {
  const map = window.__calendarCompletionMap || {};
  const isParent = window.__calendarIsParent;
  const detail = map[date] || { byChild: {} };
  const container = document.getElementById('calendarChildContent');
  if (!container) return;
  renderFamilyCompletion(detail);

  if (isParent) {
    const children = window.__calendarChildren || [];
    const targetId = activeChildId || (children[0] ? children[0].id : '');
    if (targetId === 'all') {
      container.innerHTML = buildGroupedTaskList(children, detail);
      return;
    }
    const stats = detail.byChild[targetId] || { total: 0, complete: 0, tasks: [] };
    container.innerHTML = buildSingleChildDetail(stats);
    return;
  }

  const userId = window.__calendarUserId;
  const stats = detail.byChild[userId] || { total: 0, complete: 0, tasks: [] };
  container.innerHTML = buildSingleChildDetail(stats);
}

/**
 * collapsePanel: executes this module action.
 */
function collapsePanel(panelId, container) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('d-none');

  if (!container) return;
  const expandBtn = container.querySelector(`[data-calendar-expand="${panelId}"]`);
  const collapseBtn = container.querySelector(`[data-calendar-collapse="${panelId}"]`);
  const controls = expandBtn ? expandBtn.closest('.calendar-child-controls') : null;
  const rail = controls ? controls.querySelector('.calendar-child-rail-track') : null;
  if (expandBtn) expandBtn.setAttribute('aria-expanded', 'false');
  if (expandBtn) expandBtn.disabled = false;
  if (expandBtn) expandBtn.setAttribute('aria-label', 'Expand child quest list');
  if (expandBtn) {
    const icon = expandBtn.querySelector('i');
    if (icon) icon.className = 'bi bi-chevron-down';
  }
  if (collapseBtn) collapseBtn.disabled = true;
  if (collapseBtn) collapseBtn.classList.add('d-none');
  if (rail) rail.classList.add('d-none');
  if (expandBtn) {
    const item = expandBtn.closest('.calendar-child-item');
    if (item) item.classList.remove('calendar-child-item-open');
  }
  syncChildControlLayout(container);
}

/**
 * openPanel: executes this module action.
 */
function openPanel(panelId, container) {
  if (!container) return;
  const allPanels = container.querySelectorAll('.calendar-child-item-panel');
  allPanels.forEach((panel) => panel.classList.add('d-none'));

  const allExpandButtons = container.querySelectorAll('[data-calendar-expand]');
  allExpandButtons.forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.disabled = false;
    const icon = button.querySelector('i');
    if (icon) icon.className = 'bi bi-chevron-down';
  });
  const allCollapseButtons = container.querySelectorAll('[data-calendar-collapse]');
  allCollapseButtons.forEach((button) => {
    button.disabled = true;
    button.classList.add('d-none');
  });
  const allRails = container.querySelectorAll('.calendar-child-rail-track');
  allRails.forEach((rail) => rail.classList.add('d-none'));

  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.remove('d-none');

  const expandBtn = container.querySelector(`[data-calendar-expand="${panelId}"]`);
  const collapseBtn = container.querySelector(`[data-calendar-collapse="${panelId}"]`);
  const controls = expandBtn ? expandBtn.closest('.calendar-child-controls') : null;
  const rail = controls ? controls.querySelector('.calendar-child-rail-track') : null;
  const itemCount = panel.querySelectorAll('.list-group-item').length;
  const showRailControls = itemCount > 1;
  if (expandBtn) {
    expandBtn.setAttribute('aria-expanded', 'true');
    expandBtn.disabled = false;
    expandBtn.setAttribute('aria-label', 'Collapse child quest list');
    const icon = expandBtn.querySelector('i');
    if (icon) icon.className = 'bi bi-chevron-up';
  }
  if (collapseBtn) collapseBtn.disabled = false;
  if (collapseBtn) collapseBtn.classList.remove('d-none');
  if (rail) rail.classList.toggle('d-none', !showRailControls);
  if (expandBtn) {
    const item = expandBtn.closest('.calendar-child-item');
    if (item) item.classList.add('calendar-child-item-open');
  }
  syncChildControlLayout(container);
}

/**
 * initializeGroupedControls: executes this module action.
 */
function initializeGroupedControls(container) {
  if (!container) return;
  const items = container.querySelectorAll('[data-calendar-item]');
  items.forEach((item) => {
    const expandBtn = item.querySelector('.calendar-expand-btn');
    const collapseBtn = item.querySelector('.calendar-collapse-btn');
    const rail = item.querySelector('.calendar-child-rail-track');
    const panel = item.querySelector('.calendar-child-item-panel');
    const isOpen = panel && !panel.classList.contains('d-none');

    if (expandBtn) {
      expandBtn.classList.remove('d-none');
      expandBtn.disabled = false;
      expandBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      expandBtn.setAttribute('aria-label', isOpen ? 'Collapse child quest list' : 'Expand child quest list');
      const icon = expandBtn.querySelector('i');
      if (icon) icon.className = isOpen ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
    }

    if (collapseBtn) {
      collapseBtn.classList.toggle('d-none', !isOpen);
      collapseBtn.disabled = !isOpen;
    }

    if (rail) {
      const itemCount = panel ? panel.querySelectorAll('.list-group-item').length : 0;
      rail.classList.toggle('d-none', !isOpen || itemCount <= 1);
    }

    item.classList.toggle('calendar-child-item-open', !!isOpen);
  });
}

/**
 * syncChildControlLayout: executes this module action.
 */
function syncChildControlLayout(container) {
  if (!container) return;

  const items = container.querySelectorAll('.calendar-child-item');
  items.forEach((item) => {
    const shell = item.querySelector('.calendar-child-shell');
    const row = item.querySelector('.calendar-child-item-row');
    const panel = item.querySelector('.calendar-child-item-panel');
    const controls = item.querySelector('.calendar-child-controls');
    const expandBtn = item.querySelector('.calendar-expand-btn');
    const collapseBtn = item.querySelector('.calendar-collapse-btn');
    const rail = item.querySelector('.calendar-child-rail-track');
    if (!shell || !row || !controls || !expandBtn || !collapseBtn || !panel || !rail) return;

    const btnHeight = expandBtn.offsetHeight || 28;
    const shellRect = shell.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const rowCenter = (rowRect.top - shellRect.top) + (rowRect.height / 2);
    const maxTop = Math.max(0, shellRect.height - btnHeight);
    const expandTop = Math.max(0, Math.min(maxTop, rowCenter - (btnHeight / 2)));
    controls.style.setProperty('--expand-btn-top', `${expandTop}px`);

    let collapseTarget = panel;
    const lastItem = panel.querySelector('.list-group-item:last-child');
    if (lastItem) collapseTarget = lastItem;
    const targetRect = collapseTarget.getBoundingClientRect();
    const targetCenter = (targetRect.top - shellRect.top) + (targetRect.height / 2);
    const collapseTopRaw = Math.max(expandTop + btnHeight + 8, targetCenter - (btnHeight / 2));
    const collapseTop = Math.max(0, Math.min(maxTop, collapseTopRaw));
    controls.style.setProperty('--collapse-btn-top', `${collapseTop}px`);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const cells = document.querySelectorAll('.fj-calendar-cell[data-date]');
  const selectedClass = 'fj-calendar-cell-selected';
  let activeChildId = window.__calendarActiveChildId || 'all';
  const detailContainer = document.getElementById('calendarChildContent');

  /**
   * setSelected: executes this module action.
   */
  function setSelected(date) {
    cells.forEach((cell) => {
      const isMatch = cell.getAttribute('data-date') === date;
      cell.classList.toggle(selectedClass, isMatch);
    });
  }

  /**
   * rerenderForDate: executes this module action.
   */
  function rerenderForDate(date) {
    renderDetail(date, activeChildId);
    initializeGroupedControls(detailContainer);
    syncChildControlLayout(detailContainer);
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', function () {
      const date = cell.getAttribute('data-date');
      if (!date) return;
      setSelected(date);
      rerenderForDate(date);
    });
  });

  const initialDate = window.__calendarSelectedDate || '';
  setSelected(initialDate);
  rerenderForDate(initialDate);

  if (detailContainer) {
    detailContainer.addEventListener('click', function (event) {
      const expandBtn = event.target.closest('[data-calendar-expand]');
      if (expandBtn) {
        const panelId = expandBtn.getAttribute('data-calendar-expand');
        if (!panelId) return;
        const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          collapsePanel(panelId, detailContainer);
        } else {
          openPanel(panelId, detailContainer);
        }
        return;
      }

      const collapseBtn = event.target.closest('[data-calendar-collapse]');
      if (collapseBtn) {
        const panelId = collapseBtn.getAttribute('data-calendar-collapse');
        if (!panelId) return;
        collapsePanel(panelId, detailContainer);
      }
    });

    window.addEventListener('resize', function () {
      syncChildControlLayout(detailContainer);
    });
  }

  // Child selection handled via header dropdown navigation.
});
