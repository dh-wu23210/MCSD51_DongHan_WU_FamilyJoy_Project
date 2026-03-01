/** Module: shopController. Handles shopController responsibilities. */

const rewardService = require('../services/rewardService');
const shopService = require('../services/shopService');
const userService = require('../services/userService');
const { validateRewardDefinition, validateRewardAssignment } = require('../validators/rewardValidator');
const { buildChildShopViewModel, buildShopHomeViewModel, buildShopAssignViewModel } = require('../viewModels/shopViewModel');
const { redirectError } = require('./controllerHelpers');
const { applyIconClass } = require('../utils/iconUtils');
const FALLBACK_ERROR = 'Operation failed';

// Parent shop home (similar to quest dashboard)
exports.getShopHome = async (req, res) => {
  if (req.session.user.role === 'child') {
    return exports.getChildShop(req, res);
  }

  const user = req.session.user;
  const requestedChildId = req.query.childId || '';
  const children = await userService.listActiveChildrenByFamily(user.familyId);
  const selectedChildId = requestedChildId || 'all';
  const rewardData = await rewardService.listRewardsWithAssignments(user.familyId);
  const iconKeys = rewardService.getIconKeys();

  if (selectedChildId === 'all') {
    return res.render('pages/shop/shop_parent_home', buildShopHomeViewModel({
      user,
      children,
      selectedChildId: 'all',
      rewards: applyIconClass(rewardData.rewards || []),
      iconKeys,
      query: req.query
    }));
  }

  const activeChild = children.find((child) => String(child.id) === String(selectedChildId)) || children[0] || null;
  if (!activeChild) {
    return res.render('pages/shop/shop_parent_home', buildShopHomeViewModel({
      user,
      children,
      selectedChildId: 'all',
      query: { ...req.query, error: 'No active child members found.' }
    }));
  }

  const assigned = await shopService.getChildShopData(activeChild.id);

  return res.render('pages/shop/shop_assign', buildShopAssignViewModel({
    user,
    activeChild,
    children,
    rewards: applyIconClass(rewardData.rewards || []),
    assigned: applyIconClass(assigned.rewards || []),
    query: req.query
  }));
};

// Parent reward library page
exports.getRewardLibrary = async (req, res) => {
  return res.redirect('/shop?childId=all');
};

// Parent child shop management page
exports.getChildShopManage = async (req, res) => {
  const childId = req.params.childId;
  if (!childId) {
    return res.redirect('/shop');
  }
  return res.redirect(`/shop?childId=${encodeURIComponent(childId)}`);
};

/**
 * postCreateReward: executes this module action.
 */
exports.postCreateReward = async (req, res) => {
  const user = req.session.user;
  const validation = validateRewardDefinition(req.body);
  if (!validation.ok) {
    return redirectError(res, '/shop', validation.error);
  }
  await rewardService.createReward({
    familyId: user.familyId,
    ...validation.value
  });
  res.redirect('/shop?message=Reward created');
};

/**
 * postEditReward: executes this module action.
 */
exports.postEditReward = async (req, res) => {
  const user = req.session.user;
  const validation = validateRewardDefinition(req.body);
  if (!validation.ok) {
    return redirectError(res, '/shop', validation.error);
  }
  await rewardService.updateReward({
    id: req.params.id,
    familyId: user.familyId,
    ...validation.value
  });
  res.redirect('/shop?message=Reward updated');
};

/**
 * postToggleReward: executes this module action.
 */
exports.postToggleReward = async (req, res) => {
  const user = req.session.user;
  try {
    await rewardService.toggleReward({ id: req.params.id, familyId: user.familyId });
    res.redirect('/shop?message=Reward status updated');
  } catch (error) {
    return redirectError(res, '/shop', error.message || FALLBACK_ERROR);
  }
};

/**
 * postDeleteReward: executes this module action.
 */
exports.postDeleteReward = async (req, res) => {
  const user = req.session.user;
  try {
    await rewardService.deleteReward({ id: req.params.id, familyId: user.familyId });
    res.redirect('/shop?message=Reward deleted');
  } catch (error) {
    return redirectError(res, '/shop', error.message || FALLBACK_ERROR);
  }
};

/**
 * postAssignReward: executes this module action.
 */
exports.postAssignReward = async (req, res) => {
  const user = req.session.user;
  const validation = validateRewardAssignment(req.body);
  if (!validation.ok) {
    return redirectError(res, '/shop', validation.error);
  }
  try {
    await rewardService.assignRewardToChild({
      familyId: user.familyId,
      ...validation.value
    });
    const childIdParam = encodeURIComponent(validation.value.childId);
    res.redirect(`/shop?childId=${childIdParam}&message=Assignment updated`);
  } catch (error) {
    return redirectError(res, '/shop', error.message || FALLBACK_ERROR);
  }
};

/**
 * postUnassignReward: executes this module action.
 */
exports.postUnassignReward = async (req, res) => {
  const user = req.session.user;
  const validation = validateRewardAssignment(req.body);
  if (!validation.ok) {
    return redirectError(res, '/shop', validation.error);
  }
  try {
    await rewardService.unassignRewardFromChild({
      familyId: user.familyId,
      ...validation.value
    });
    const childIdParam = encodeURIComponent(validation.value.childId);
    res.redirect(`/shop?childId=${childIdParam}&message=Assignment updated`);
  } catch (error) {
    return redirectError(res, '/shop', error.message || FALLBACK_ERROR);
  }
};

// Child shop page
exports.getChildShop = async (req, res) => {
  const user = req.session.user;
  const { rewards } = await shopService.getChildShopData(user.id);
  res.render('pages/shop/shop_child_home', buildChildShopViewModel({
    user,
    rewards: applyIconClass(rewards),
    query: req.query
  }));
};

/**
 * postPurchaseReward: executes this module action.
 */
exports.postPurchaseReward = async (req, res) => {
  const user = req.session.user;
  const rewardId = req.params.rewardId;
  if (!rewardId) {
    return redirectError(res, '/shop', 'Reward not found');
  }

  try {
    await shopService.purchaseReward({ childId: user.id, rewardId });
    res.redirect('/shop?message=Purchase successful');
  } catch (error) {
    return redirectError(res, '/shop', error.message || FALLBACK_ERROR);
  }
};
