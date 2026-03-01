/** Module: calendarViewModel. Handles calendarViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');
const { formatDateString, getServerDateString } = require('../utils/dateUtils');

/**
 * buildCalendarGrid: executes this module action.
 */
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const end = new Date(year, month, lastDay.getDate() + (6 - lastDay.getDay()));

  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push({
      date: formatDateString(d),
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isCurrentMonth: d.getMonth() === month
    });
  }
  return days;
}

/**
 * buildCompletionMap: executes this module action.
 */
function buildCompletionMap(rows) {
  const map = {};
  rows.forEach((row) => {
    const dateKey = formatDateString(row.target_date);
    if (!map[dateKey]) {
      map[dateKey] = { total: 0, complete: 0, byChild: {} };
    }
    map[dateKey].total += 1;
    if (row.status === 'complete') map[dateKey].complete += 1;
    if (!map[dateKey].byChild[row.child_id]) {
      map[dateKey].byChild[row.child_id] = { total: 0, complete: 0, tasks: [] };
    }
    map[dateKey].byChild[row.child_id].total += 1;
    if (row.status === 'complete') map[dateKey].byChild[row.child_id].complete += 1;
    map[dateKey].byChild[row.child_id].tasks.push({
      name: row.name,
      status: row.status,
      crystals: row.base_crystals || 0
    });
  });
  return map;
}

/**
 * buildCalendarViewModel: executes this module action.
 */
function buildCalendarViewModel(options) {
  const config = options || {};
  const user = config.user || {};
  const isParent = user.role === 'parent';
  const rows = config.rows || [];
  const year = config.year;
  const month = config.month;
  const children = config.children || [];
  const query = config.query || {};

  const calendarDays = buildCalendarGrid(year, month);
  const completionMap = buildCompletionMap(rows);
  const today = getServerDateString();
  const monthLabel = `${month + 1}/${year}`;
  const todayParts = String(today || '').split('-').map((part) => Number(part));
  const todayDate = new Date(todayParts[0], (todayParts[1] || 1) - 1, todayParts[2] || 1);
  const todayDisplayLabel = todayDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const monthDisplayLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const childIds = (children || []).map((child) => String(child.id));
  calendarDays.forEach((day) => {
    const info = completionMap[day.date];
    if (isParent) {
      const divisor = childIds.length;
      if (!divisor) {
        day.completionRate = 0;
      } else {
        const totalRate = childIds.reduce((sum, childId) => {
          const stats = info && info.byChild ? (info.byChild[childId] || { total: 0, complete: 0 }) : { total: 0, complete: 0 };
          const rate = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0;
          return sum + rate;
        }, 0);
        day.completionRate = Math.round(totalRate / divisor);
      }
    } else {
      const ownStats = info && info.byChild ? (info.byChild[user.id] || { total: 0, complete: 0 }) : { total: 0, complete: 0 };
      day.completionRate = ownStats.total > 0 ? Math.round((ownStats.complete / ownStats.total) * 100) : 0;
    }
    day.cellClass = day.isCurrentMonth ? '' : 'fj-calendar-cell-muted';
    if (day.date === today) {
      day.cellClass = `${day.cellClass} fj-calendar-cell-today`.trim();
    }
    day.isDisabled = !day.isCurrentMonth;
    day.disabledAttr = day.isDisabled ? 'disabled' : '';
  });

  const selectedDate = today;
  const detail = completionMap[selectedDate] || { byChild: {} };
  const childTabs = isParent ? children.map((child, idx) => {
    const stats = detail.byChild[child.id] || { total: 0, complete: 0, tasks: [] };
    const rate = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
    const isActive = idx === 0;
    const displayName = child.nickname || child.username || 'Child';
    const initialSource = displayName || child.username || 'C';
    return {
      id: child.id,
      name: displayName,
      initial: initialSource.slice(0, 1).toUpperCase(),
      tasks: stats.tasks,
      completionRate: rate,
      isActive,
      tabClass: `nav-link d-flex flex-column align-items-center gap-1 px-2${isActive ? ' active' : ''}`
    };
  }) : [];
  const selectedChildId = config.selectedChildId || '';
  const headerChildMenu = [
    { id: 'all', label: 'All Children', initial: 'A', href: `/calendar?${config.monthParam ? `month=${encodeURIComponent(config.monthParam)}&` : ''}childId=all` },
    ...childTabs.map((child) => {
      const params = [];
      if (config.monthParam) params.push(`month=${encodeURIComponent(config.monthParam)}`);
      params.push(`childId=${encodeURIComponent(child.id)}`);
      const href = `/calendar?${params.join('&')}`;
      return {
        id: child.id,
        label: child.name,
        initial: child.initial,
        href
      };
    })
  ];
  const resolvedChildId = selectedChildId || 'all';
  const selectedChild = headerChildMenu.find((child) => String(child.id) === String(resolvedChildId));
  const firstChild = selectedChild || headerChildMenu[0] || null;

  const childDetail = !isParent && detail.byChild[user.id]
    ? detail.byChild[user.id].tasks
    : (detail.byChild[user.id]?.tasks || []);

  return {
    ...buildPageDefaults({
      user,
      current: 'calendar',
      message: query.message || '',
      error: query.error || ''
    }),
    isParent,
    monthLabel,
    todayDisplayLabel,
    monthDisplayLabel,
    calendarDays,
    selectedDate,
    childTabs,
    hasChildTabs: childTabs.length > 0,
    childDetail,
    month,
    year,
    completionMap,
    completionMapJson: JSON.stringify(completionMap || {}),
    childTabsJson: JSON.stringify(childTabs || []),
    headerChildMenu,
    headerChildLabel: firstChild ? firstChild.label : 'Select Child',
    headerChildInitial: firstChild ? firstChild.initial : 'C',
    headerChildMode: 'calendar',
    headerChildId: firstChild ? firstChild.id : 'all',
    hideHeaderChildSwitcher: true,
    activeChildId: firstChild ? firstChild.id : 'all',
    selectedDateJson: JSON.stringify(selectedDate || ''),
    isParentJson: JSON.stringify(isParent),
    userIdJson: JSON.stringify(user.id || ''),
    prevMonthParam: formatDateString(new Date(year, month - 1, 1)),
    nextMonthParam: formatDateString(new Date(year, month + 1, 1))
  };
}

module.exports = {
  buildCalendarViewModel
};
