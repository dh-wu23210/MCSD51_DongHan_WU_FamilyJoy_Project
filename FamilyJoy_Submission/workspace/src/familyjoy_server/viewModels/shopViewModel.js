/** Module: shopViewModel. Handles shopViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');
const { getIconClass } = require('../utils/iconUtils');

/**
 * sortChildrenByLabel: executes this module action.
 */
function sortChildrenByLabel(children) {
  return [...(children || [])].sort((a, b) => {
    const aLabel = (a.nickname || a.username || '').trim().toLowerCase();
    const bLabel = (b.nickname || b.username || '').trim().toLowerCase();
    return aLabel.localeCompare(bLabel);
  });
}

/**
 * buildParentScopeTabs: executes this module action.
 */
function buildParentScopeTabs(children, selectedChildId) {
  const orderedChildren = sortChildrenByLabel(children);
  const tabs = [
    { id: 'all', label: 'Warehouse', href: '/shop?childId=all', isActive: String(selectedChildId || 'all') === 'all' },
    ...orderedChildren.map((child) => ({
      id: child.id,
      label: child.nickname || child.username || 'Child',
      href: `/shop?childId=${encodeURIComponent(child.id)}`,
      isActive: String(child.id) === String(selectedChildId || '')
    }))
  ];
  return tabs;
}

/**
 * buildParentShopViewModel: executes this module action.
 */
function buildParentShopViewModel(options) {
  const config = options || {};
  const rewards = (config.rewards || []).map((reward) => ({
    ...reward,
    isInactive: reward.status === 'inactive',
    statusLabel: reward.status === 'inactive' ? 'Inactive' : '',
    priceLabel: `${reward.price} crystals`
  }));
  const iconOptions = (config.iconKeys || []).map((iconKey) => ({
    key: iconKey,
    iconClass: getIconClass(iconKey)
  }));
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'shop',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    rewards,
    hasRewards: rewards.length > 0,
    children: config.children || [],
    iconOptions,
    assignmentMap: config.assignmentMap || {},
    assignmentMapJson: JSON.stringify(config.assignmentMap || {})
  };
}

/**
 * buildShopHomeViewModel: executes this module action.
 */
function buildShopHomeViewModel(options) {
  const config = options || {};
  const children = sortChildrenByLabel(config.children || []).map((child) => {
    const displayName = child.nickname || child.username || '';
    const initialSource = displayName || child.username || 'C';
    return {
      ...child,
      displayName,
      initial: initialSource.slice(0, 1).toUpperCase()
    };
  });
  const headerChildMenu = [
    { id: 'all', label: 'All Children', initial: 'A', href: '/shop?childId=all' },
    ...children.map((child) => ({
      id: child.id,
      label: child.displayName || child.username || 'Child',
      initial: child.initial,
      href: `/shop?childId=${encodeURIComponent(child.id)}`
    }))
  ];
  const selectedChildId = config.selectedChildId || 'all';
  const selectedChild = headerChildMenu.find((child) => String(child.id) === String(selectedChildId));
  const headerChildInitial = selectedChild?.initial || headerChildMenu[0]?.initial || 'C';
  const headerChildId = selectedChild?.id || headerChildMenu[0]?.id || '';
  const headerChildLabel = selectedChild?.label || headerChildMenu[0]?.label || 'Select Child';
  const rewards = (config.rewards || []).map((reward) => ({
    ...reward,
    isInactive: reward.status === 'inactive',
    statusLabel: reward.status === 'inactive' ? 'Inactive' : '',
    priceLabel: `${reward.price} crystals`
  }));
  const iconOptions = (config.iconKeys || []).map((iconKey) => ({
    key: iconKey,
    iconClass: getIconClass(iconKey)
  }));
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'shop',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    children,
    hasChildren: children.length > 0,
    parentScopeTabs: buildParentScopeTabs(children, selectedChildId),
    headerChildMenu,
    headerChildLabel,
    headerChildInitial,
    headerChildMode: 'link',
    headerChildId,
    hideHeaderChildSwitcher: true,
    rewards,
    hasRewards: rewards.length > 0,
    iconOptions
  };
}

/**
 * buildShopAssignViewModel: executes this module action.
 */
function buildShopAssignViewModel(options) {
  const config = options || {};
  const activeChild = config.activeChild || null;
  const orderedChildren = sortChildrenByLabel(config.children || []);
  const assigned = (config.assigned || []).map((item) => ({
    ...item,
    isInactive: item.status !== 'active',
    statusLabel: item.status !== 'active' ? 'Inactive' : '',
    priceLabel: `${item.price} crystals`,
    isUnlimited: Number(item.quantity) < 0,
    quantityLabel: Number(item.quantity) < 0 ? 'Unlimited' : `x${item.quantity}`
  }));
  const assignedIdSet = new Set(assigned.map((item) => String(item.id)));
  const cards = (config.rewards || []).map((reward) => ({
    ...reward,
    isAssigned: assignedIdSet.has(String(reward.id)),
    isInactive: reward.status !== 'active',
    statusLabel: reward.status !== 'active' ? 'Inactive' : '',
    priceLabel: `${reward.price} crystals`
  }));
  const minSlots = 9;
  const totalSlots = Math.max(cards.length, minSlots);
  const cardSlots = [];
  for (let i = 0; i < totalSlots; i += 1) {
    cardSlots.push(cards[i] || null);
  }
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'shop',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    activeChild,
    children: orderedChildren,
    parentScopeTabs: buildParentScopeTabs(orderedChildren, activeChild ? activeChild.id : 'all'),
    rewards: cards,
    cardSlots,
    assigned,
    hasChildren: (config.children || []).length > 0,
    hasActiveChild: Boolean(activeChild),
    hasAssigned: assigned.length > 0,
    activeChildLabel: activeChild
      ? (activeChild.nickname || activeChild.username || 'Child')
      : 'Child',
    headerChildMenu: [
      { id: 'all', label: 'All Children', initial: 'A', href: '/shop?childId=all' },
      ...(config.children || []).map((child) => {
        const displayName = child.nickname || child.username || 'Child';
        const initialSource = displayName || child.username || 'C';
        return {
          id: child.id,
          label: displayName,
          initial: initialSource.slice(0, 1).toUpperCase(),
          href: `/shop?childId=${encodeURIComponent(child.id)}`
        };
      })
    ],
    headerChildLabel: activeChild
      ? (activeChild.nickname || activeChild.username || 'Child')
      : 'Select Child',
    headerChildInitial: activeChild
      ? (activeChild.nickname || activeChild.username || 'C').slice(0, 1).toUpperCase()
      : 'C',
    headerChildMode: 'link',
    headerChildId: activeChild ? activeChild.id : '',
    hideHeaderChildSwitcher: true
  };
}

/**
 * buildChildShopViewModel: executes this module action.
 */
function buildChildShopViewModel(options) {
  const config = options || {};
  const rewards = (config.rewards || []).map((reward) => {
    const isInactive = reward.status !== 'active';
    const isUnlimited = Number(reward.quantity) < 0;
    const hasStock = isUnlimited || (reward.quantity || 0) > 0;
    const isDisabled = isInactive || !hasStock;
    return {
      ...reward,
      isInactive,
      isUnlimited,
      isDisabled,
      cardClass: isDisabled ? 'opacity-50' : '',
      disabledAttr: isDisabled ? 'disabled' : '',
      confirmText: `Buy this reward for ${reward.price} crystals?`,
      priceLabel: `${reward.price} crystals`,
      quantityLabel: isUnlimited ? 'Unlimited' : `x${reward.quantity || 0}`
    };
  });
  return {
    ...buildPageDefaults({
      user: config.user,
      current: 'shop',
      message: config.query?.message || '',
      error: config.query?.error || ''
    }),
    rewards,
    hasRewards: rewards.length > 0
  };
}

module.exports = {
  buildParentShopViewModel,
  buildShopHomeViewModel,
  buildShopAssignViewModel,
  buildChildShopViewModel
};
