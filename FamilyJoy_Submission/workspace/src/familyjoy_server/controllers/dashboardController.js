/** Module: dashboardController. Handles dashboardController responsibilities. */

const userService = require('../services/userService');
const wishService = require('../services/wishService');
const backpackService = require('../services/backpackService');
const spiritTreeService = require('../services/spiritTreeService');
const questService = require('../services/questService');
const { getServerDateString } = require('../utils/dateUtils');
const { buildChildDashboardViewModel, buildChildBackpackViewModel, buildParentDashboardViewModel } = require('../viewModels/dashboardViewModel');

// Dashboard (main landing page after login for parents)
exports.getDashboard = async (req, res) => {
  const user = req.session.user;
  if (user.role === 'child') {
    const allItems = await backpackService.listAllItems(user.id);
    const wishes = await wishService.listChildOpenWishes(user.id);
    const spiritTreeCurrent = await spiritTreeService.ensureChildCurrentFromYesterday(user.id, user.familyId);
    const todayCompletionRate = await questService.getChildCompletionRateByDate(user.id, getServerDateString(0));

    return res.render('pages/dashboard/child_dashboard', buildChildDashboardViewModel({
      user,
      backpackAll: allItems,
      wishes,
      spiritTreeCurrent,
      todayCompletionRate,
      query: req.query
    }));
  }

  const children = await userService.listActiveChildrenByFamily(user.familyId);
  const spiritRows = await spiritTreeService.ensureFamilyCurrentFromYesterday(children || [], user.familyId);
  const spiritMap = new Map((spiritRows || []).map((row) => [String(row.childId), row]));
  const todayDate = getServerDateString(0);
  const todayCompletionEntries = await Promise.all((children || []).map(async (child) => {
    const todayCompletionRate = await questService.getChildCompletionRateByDate(child.id, todayDate);
    return [String(child.id), Number(todayCompletionRate || 0)];
  }));
  const todayCompletionMap = new Map(todayCompletionEntries);

  const childrenWithCompletion = (children || []).map((child) => {
    const spirit = spiritMap.get(String(child.id));
    return {
      ...child,
      spiritTreeCurrent: spirit || null,
      yesterdayCompletionRate: Number(spirit?.completionRate || 0),
      todayCompletionRate: Number(todayCompletionMap.get(String(child.id)) || 0)
    };
  });
  const wishes = await wishService.listFamilyOpenWishes(user.familyId);
  res.render('pages/dashboard/parent_dashboard', buildParentDashboardViewModel({
    user,
    children: childrenWithCompletion,
    wishes,
    query: req.query
  }));
};

/**
 * getChildBackpack: executes this module action.
 */
exports.getChildBackpack = async (req, res) => {
  const user = req.session.user;
  const allItems = await backpackService.listAllItems(user.id);
  return res.render('pages/backpack/child_backpack', buildChildBackpackViewModel({
    user,
    backpackAll: allItems,
    query: req.query
  }));
};

