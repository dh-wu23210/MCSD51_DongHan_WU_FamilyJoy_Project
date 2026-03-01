/** Module: questViewModel. Handles questViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');
const { QUEST_CATEGORIES } = require('../constants/questCategories');

/**
 * buildQuestHomeViewModel: executes this module action.
 */
function buildQuestHomeViewModel(options) {
  const config = options || {};
  const user = config.user || {};
  const isParent = user.role === 'parent';
  const children = (config.children || []).map((child) => {
    const displayName = child.nickname || child.username || '';
    const initialSource = displayName || child.username || 'C';
    return {
      id: child.id,
      displayName,
      username: child.username,
      initial: initialSource.slice(0, 1).toUpperCase()
    };
  }).sort((a, b) => String(a.displayName || a.username || '').localeCompare(String(b.displayName || b.username || ''), 'en', { sensitivity: 'base' }));
  const headerChildMenu = isParent
    ? [
      { id: 'all', label: 'All Children', initial: 'A', href: '/quest?childId=all' },
      ...children.map((child) => ({
        id: child.id,
        label: child.displayName || child.username || 'Child',
        initial: child.initial,
        href: `/quest?childId=${encodeURIComponent(child.id)}`
      }))
    ]
    : [];
  const selectedChildId = config.selectedChildId || '';
  const selectedChild = headerChildMenu.find((child) => String(child.id) === String(selectedChildId));
  const firstOption = headerChildMenu[0];
  const headerChildInitial = selectedChild?.initial || firstOption?.initial || 'C';
  const headerChildLabel = selectedChild?.label || firstOption?.label || 'Select Child';
  const headerChildId = selectedChild?.id || firstOption?.id || '';
  return {
    ...buildPageDefaults({
      user,
      current: 'quest',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    isParent,
    children,
    hasChildren: children.length > 0,
    selectedChildId,
    headerChildMenu,
    headerChildLabel,
    headerChildInitial,
    headerChildMode: 'link',
    headerChildId,
    hideHeaderChildSwitcher: isParent
  };
}

/**
 * buildQuestChildViewModel: executes this module action.
 */
function buildQuestChildViewModel(options) {
  const config = options || {};
  const list = config.list || {};
  const statusPriority = {
    assigned: 0,
    submitted: 1,
    incomplete: 2,
    complete: 3
  };

  /**
   * sortChildTasks: executes this module action.
   */
  const sortChildTasks = (tasks) => {
    return [...(tasks || [])].sort((a, b) => {
      const priorityA = Object.prototype.hasOwnProperty.call(statusPriority, a.status) ? statusPriority[a.status] : 9;
      const priorityB = Object.prototype.hasOwnProperty.call(statusPriority, b.status) ? statusPriority[b.status] : 9;
      if (priorityA !== priorityB) return priorityA - priorityB;
      const nameA = String(a.name || '').toLowerCase();
      const nameB = String(b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  };

  /**
   * mapTask: executes this module action.
   */
  const mapTask = (task, showSubmit) => {
    const totalCrystals = Number(task.base_crystals || 0);
    const earnedCrystals = task.status === 'complete' ? totalCrystals : 0;
    const statusLabelMap = {
      assigned: 'Assigned',
      submitted: 'Submitted',
      incomplete: 'Incomplete',
      complete: 'Complete'
    };
    const statusClassMap = {
      assigned: 'quest-status-badge quest-status-assigned',
      submitted: 'quest-status-badge quest-status-submitted',
      incomplete: 'quest-status-badge quest-status-incomplete',
      complete: 'quest-status-badge quest-status-complete'
    };

    return {
      id: task.id,
      statusLabel: statusLabelMap[task.status] || task.status,
      statusBadgeClass: statusClassMap[task.status] || 'quest-status-badge quest-status-incomplete',
      name: task.name,
      categoryLabel: task.category,
      baseCrystals: totalCrystals,
      earnedCrystals,
      descriptionText: String(task.description || '').trim() || 'No description.',
      showSubmit,
      submitAction: `/quest/detail/${task.id}/submit`,
      confirmTitle: 'Submit Quest',
      confirmBody: 'Submit this quest? You cannot resubmit once submitted.',
      submitText: 'Submit'
    };
  };

  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'quest',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    todayTasks: sortChildTasks(list.todayTasks || []).map((task) => mapTask(task, task.status === 'assigned')),
    tomorrowTasks: sortChildTasks(list.tomorrowTasks || []).map((task) => mapTask(task, false)),
    hasTodayTasks: (list.todayTasks || []).length > 0,
    hasTomorrowTasks: (list.tomorrowTasks || []).length > 0,
    today: list.today,
    tomorrow: list.tomorrow
  };
}


/**
 * buildQuestAssignViewModel: executes this module action.
 */
function buildQuestAssignViewModel(options) {
  const config = options || {};
  const data = config.data || {};
  const activeTab = config.activeTab === 'tomorrow' ? 'tomorrow' : 'today';
  const todayLabel = data.today ? `Today (${data.today})` : 'Today';
  const tomorrowLabel = data.tomorrow ? `Tomorrow (${data.tomorrow})` : 'Tomorrow';

  /**
   * buildItem: executes this module action.
   */
  const buildItem = (task) => {
    const totalCrystals = Number(task.base_crystals || 0);
    const earnedCrystals = task.status === 'complete' ? totalCrystals : 0;
    const statusLabelMap = {
      assigned: 'Assigned',
      submitted: 'Submitted',
      incomplete: 'Incomplete',
      complete: 'Complete'
    };
    const statusClassMap = {
      assigned: 'quest-status-badge quest-status-assigned',
      submitted: 'quest-status-badge quest-status-submitted',
      incomplete: 'quest-status-badge quest-status-incomplete',
      complete: 'quest-status-badge quest-status-complete'
    };

    return {
      id: task.id,
      name: task.name,
      category: task.category,
      descriptionText: String(task.description || '').trim() || 'No description.',
      baseCrystals: totalCrystals,
      earnedCrystals,
      status: task.status,
      statusLabel: statusLabelMap[task.status] || task.status,
      statusBadgeClass: statusClassMap[task.status] || 'quest-status-badge quest-status-incomplete',
      canDelete: task.status === 'assigned',
      canApprove: task.status === 'submitted',
      canDisapprove: task.status === 'submitted'
    };
  };

  const statusPriority = {
    submitted: 0,
    assigned: 1,
    complete: 2,
    incomplete: 3
  };

  /**
   * sortAssignItems: executes this module action.
   */
  const sortAssignItems = (items) => {
    return [...(items || [])].sort((a, b) => {
      const priorityA = Object.prototype.hasOwnProperty.call(statusPriority, a.status) ? statusPriority[a.status] : 9;
      const priorityB = Object.prototype.hasOwnProperty.call(statusPriority, b.status) ? statusPriority[b.status] : 9;
      if (priorityA !== priorityB) return priorityA - priorityB;
      const nameA = String(a.name || '').toLowerCase();
      const nameB = String(b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  };

  const normalizeCategory = (value) => String(value || '').trim().toLowerCase();
  /**
   * buildCategoryLabel: executes this module action.
   */
  const buildCategoryLabel = (value) => {
    const normalized = normalizeCategory(value);
    if (!normalized) return 'Others';
    return normalized
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const activeDefinitions = (data.definitions || []).map((def) => ({
    id: def.id,
    name: def.name,
    category: normalizeCategory(def.category),
    categoryLabel: buildCategoryLabel(def.category),
    baseCrystals: Number(def.base_crystals || 0)
  }));

  const assignedDefinitionIdsByDay = {
    today: new Set((data.todayTasks || []).map((task) => task.quest_definition_id).filter(Boolean)),
    tomorrow: new Set((data.tomorrowTasks || []).map((task) => task.quest_definition_id).filter(Boolean))
  };

  /**
   * buildAssignableDefinitions: executes this module action.
   */
  const buildAssignableDefinitions = (dayKey) => {
    const assignedSet = assignedDefinitionIdsByDay[dayKey] || new Set();
    return activeDefinitions
      .filter((def) => !assignedSet.has(def.id))
      .map((def) => ({
        id: def.id,
        name: def.name,
        category: def.category,
        categoryLabel: def.categoryLabel,
        baseCrystals: def.baseCrystals,
        label: `${def.name} (${def.categoryLabel})`
      }));
  };

  const assignOptionsByDay = {
    today: buildAssignableDefinitions('today'),
    tomorrow: buildAssignableDefinitions('tomorrow')
  };

  const allCategories = QUEST_CATEGORIES.map((category) => ({
    value: category,
    label: buildCategoryLabel(category)
  }));

  const categoriesByDay = {
    today: allCategories,
    tomorrow: allCategories
  };

  const sections = [
    {
      key: 'today',
      label: 'Today',
      tabId: 'today',
      isActive: activeTab === 'today',
      emptyText: 'No quests assigned for today.',
      items: sortAssignItems((data.todayTasks || []).map(buildItem))
    },
    {
      key: 'tomorrow',
      label: 'Tomorrow',
      tabId: 'tomorrow',
      isActive: activeTab === 'tomorrow',
      emptyText: 'No quests assigned for tomorrow.',
      items: sortAssignItems((data.tomorrowTasks || []).map(buildItem))
    }
  ];

  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'quest',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    children: data.children || [],
    activeChild: data.activeChild || null,
    activeChildId: data.activeChild ? data.activeChild.id : '',
    activeChildLabel: data.activeChild
      ? (data.activeChild.nickname || data.activeChild.username || 'Child')
      : 'Child',
    sections: sections.map((section) => ({
      ...section,
      hasItems: (section.items || []).length > 0,
      tabClass: `nav-link${section.isActive ? ' active' : ''}`,
      paneClass: `tab-pane fade${section.isActive ? ' show active' : ''}`
    })),
    definitions: data.definitions || [],
    definitionOptions: (data.definitions || []).map((def) => ({
      id: def.id,
      label: `${def.name} (${def.category})`
    })),
    assignOptionsByDay,
    assignCategoriesByDay: categoriesByDay,
    today: data.today,
    tomorrow: data.tomorrow,
    activeTab,
    activeTabLabel: activeTab === 'tomorrow' ? tomorrowLabel : todayLabel,
    todayLabel,
    tomorrowLabel,
    hasChildren: (data.children || []).length > 0,
    hasActiveChild: Boolean(data.activeChild),
    showAddButton: (data.children || []).length > 0 && data.activeChild,
    headerChildMenu: (data.children || []).map((child) => {
      const displayName = child.nickname || child.username || 'Child';
      const initialSource = displayName || child.username || 'C';
      return {
        id: child.id,
        label: displayName,
        initial: initialSource.slice(0, 1).toUpperCase(),
        href: `/quest?childId=${encodeURIComponent(child.id)}`
      };
    }),
    headerChildLabel: data.activeChild
      ? (data.activeChild.nickname || data.activeChild.username || 'Child')
      : 'Select Child',
    headerChildInitial: data.activeChild
      ? (data.activeChild.nickname || data.activeChild.username || 'C').slice(0, 1).toUpperCase()
      : 'C',
    headerChildMode: 'link',
    headerChildId: data.activeChild ? data.activeChild.id : ''
  };
}

/**
 * buildQuestDetailViewModel: executes this module action.
 */
function buildQuestDetailViewModel(options) {
  const config = options || {};
  const task = config.task;
  const today = config.today;
  const isToday = task && String(task.target_date) === String(today);
  const canSubmit = task && task.status === 'assigned' && isToday;
  const descriptionText = task && task.description ? task.description : '';

  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'quest',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    task: task ? {
      ...task,
      descriptionText,
      hasDescription: Boolean(descriptionText)
    } : null,
    canSubmit,
    submitUnavailableText: 'This quest cannot be submitted.',
    statusLabel: task ? task.status : '',
    targetDateLabel: task ? task.target_date : '',
    submitAction: task ? `/quest/detail/${task.id}/submit` : '',
    submitConfirmText: 'Submit this quest? You cannot resubmit once submitted.'
  };
}

module.exports = {
  buildQuestHomeViewModel,
  buildQuestChildViewModel,
  buildQuestAssignViewModel,
  buildQuestDetailViewModel
};
