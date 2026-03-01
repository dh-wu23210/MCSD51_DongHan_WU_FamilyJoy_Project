/** Module: dashboardViewModel. Handles dashboardViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');
const { applyIconClass } = require('../utils/iconUtils');
const {
  getSpiritTreeStateByCompletionRate,
  getSpiritTreeImageByState
} = require('../constants/spiritTreeStates');

/**
 * buildChildDashboardViewModel: executes this module action.
 */
function buildChildDashboardViewModel(options) {
  const config = options || {};
  const backpackAll = applyIconClass(config.backpackAll || []);
  const wishes = applyIconClass(config.wishes || []);
  const spiritTreeCurrent = config.spiritTreeCurrent || null;
  const hasSpiritData = Boolean(spiritTreeCurrent);
  const yesterdayCompletionRate = Number(spiritTreeCurrent?.completionRate || config.yesterdayCompletionRate || 0);
  const todayCompletionRate = Number(config.todayCompletionRate || 0);
  const effectiveCompletionRate = todayCompletionRate > yesterdayCompletionRate
    ? todayCompletionRate
    : yesterdayCompletionRate;
  const spiritTreeState = hasSpiritData ? getSpiritTreeStateByCompletionRate(effectiveCompletionRate) : 'healthy';
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'dashboard',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    backpackAll,
    wishes,
    spiritTreeCurrent,
    yesterdayCompletionRate,
    todayCompletionRate,
    effectiveCompletionRate,
    hasSpiritData,
    spiritTreeState,
    spiritTreeImage: getSpiritTreeImageByState(spiritTreeState),
    backpackJson: JSON.stringify(backpackAll),
    wishesJson: JSON.stringify(wishes)
  };
}

/**
 * buildChildBackpackViewModel: executes this module action.
 */
function buildChildBackpackViewModel(options) {
  const config = options || {};
  const backpackAll = applyIconClass(config.backpackAll || []);
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'backpack',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    backpackAll,
    backpackJson: JSON.stringify(backpackAll)
  };
}

/**
 * buildParentDashboardViewModel: executes this module action.
 */
function buildParentDashboardViewModel(options) {
  const config = options || {};
  const wishes = config.wishes || [];
  const wishMap = wishes.reduce((acc, wish) => {
    if (!acc[wish.child_id]) acc[wish.child_id] = [];
    acc[wish.child_id].push(wish);
    return acc;
  }, {});

  Object.keys(wishMap).forEach((childId) => {
    wishMap[childId] = applyIconClass(wishMap[childId]);
  });

  const children = (config.children || []).map((child) => {
    const hasSpiritData = Boolean(child.spiritTreeCurrent);
    const yesterdayCompletionRate = Number(child.spiritTreeCurrent?.completionRate || child.yesterdayCompletionRate || 0);
    const todayCompletionRate = Number(child.todayCompletionRate || 0);
    const effectiveCompletionRate = todayCompletionRate > yesterdayCompletionRate
      ? todayCompletionRate
      : yesterdayCompletionRate;
    const spiritTreeState = hasSpiritData ? getSpiritTreeStateByCompletionRate(effectiveCompletionRate) : 'healthy';
    return {
      ...child,
      hasSpiritData,
      yesterdayCompletionRate,
      todayCompletionRate,
      effectiveCompletionRate,
      spiritTreeState,
      spiritTreeImage: getSpiritTreeImageByState(spiritTreeState)
    };
  });
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'dashboard',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    children,
    wishMap,
    childrenJson: JSON.stringify(children),
    wishMapJson: JSON.stringify(wishMap),
    hideHeaderChildSwitcher: true
  };
}

module.exports = {
  buildChildDashboardViewModel,
  buildChildBackpackViewModel,
  buildParentDashboardViewModel
};
