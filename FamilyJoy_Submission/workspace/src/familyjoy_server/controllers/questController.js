/** Module: questController. Handles questController responsibilities. */

const questService = require('../services/questService');
const { validateQuestDefinition, validateAssignQuest, validateReview } = require('../validators/questValidator');
const FALLBACK_ERROR = 'Operation failed';
const {
  buildQuestHomeViewModel,
  buildQuestChildViewModel,
  buildQuestAssignViewModel,
  buildQuestDetailViewModel
} = require('../viewModels/questViewModel');
const { redirectError, redirectErrorWithParams } = require('./controllerHelpers');

/**
 * getQuestHome: executes this module action.
 */
exports.getQuestHome = async (req, res) => {
  const user = req.session.user;
  if (user.role === 'parent') {
    const { children } = await questService.getQuestHomeData(user);
    const childList = children || [];
    const selectedChildId = req.query.childId || 'all';
    const isAllChildren = selectedChildId === 'all';
    const activeTab = req.query.tab === 'tomorrow' ? 'tomorrow' : 'today';

    let assignView = null;
    let allChildrenView = null;
    if (isAllChildren) {
      const panel = req.query.panel === 'approval' ? 'approval' : 'book';
      const { definitions } = await questService.getQuestBookData(user.familyId);
      const groups = await questService.getReviewData(user.familyId);
      const categories = questService.getCategoryList();
      const categorySections = categories.map((category) => ({
        category,
        hasItems: (definitions || []).some((def) => def.category === category),
        items: (definitions || []).filter((def) => def.category === category)
      }));
      allChildrenView = {
        panel,
        categorySections,
        groups: groups || []
      };
    } else if (selectedChildId) {
      const data = await questService.getAssignData(user, selectedChildId);
      assignView = buildQuestAssignViewModel({
        user,
        data,
        activeTab,
        query: req.query
      });
    } else {
      assignView = buildQuestAssignViewModel({
        user,
        data: {
          children: childList,
          activeChild: null,
          todayTasks: [],
          tomorrowTasks: [],
          definitions: [],
          today: '',
          tomorrow: ''
        },
        activeTab,
        query: { ...req.query, error: 'No active child members found.' }
      });
    }

    return res.render('pages/quest/quest_home', {
      ...buildQuestHomeViewModel({
        user,
        children: childList,
        selectedChildId,
        query: req.query
      }),
      assignView,
      allChildrenView
    });
  }

  const list = await questService.getChildQuestList(user);
  return res.render('pages/quest/quest_child', buildQuestChildViewModel({
    user,
    list,
    query: req.query
  }));
};

/**
 * postCreateQuest: executes this module action.
 */
exports.postCreateQuest = async (req, res) => {
  const user = req.session.user;
  const validation = validateQuestDefinition(req.body);
  if (!validation.ok) {
    return redirectErrorWithParams(res, '/quest', {
      childId: 'all',
      panel: 'book',
      error: validation.error
    });
  }

  await questService.createQuestDefinition({
    familyId: user.familyId,
    ...validation.value
  });

  res.redirect(`/quest?childId=all&panel=book&message=Quest created&openCategory=${encodeURIComponent(validation.value.category)}`);
};

/**
 * postEditQuest: executes this module action.
 */
exports.postEditQuest = async (req, res) => {
  const user = req.session.user;
  const validation = validateQuestDefinition(req.body);
  if (!validation.ok) {
    return redirectErrorWithParams(res, '/quest', {
      childId: 'all',
      panel: 'book',
      error: validation.error
    });
  }

  await questService.updateQuestDefinition({
    id: req.params.id,
    familyId: user.familyId,
    ...validation.value
  });

  res.redirect('/quest?childId=all&panel=book&message=Quest updated');
};

/**
 * postDeleteQuest: executes this module action.
 */
exports.postDeleteQuest = async (req, res) => {
  const user = req.session.user;

  await questService.archiveQuestDefinition(req.params.id, user.familyId);

  res.redirect('/quest?childId=all&panel=book&message=Quest deleted');
};

/**
 * postAssignQuest: executes this module action.
 */
exports.postAssignQuest = async (req, res) => {
  const user = req.session.user;
  const childId = req.body.childId;
  if (!childId) {
    return redirectError(res, '/quest', 'Child not selected');
  }
  const validation = validateAssignQuest(req.body);
  if (!validation.ok) {
    return redirectErrorWithParams(res, '/quest', {
      childId,
      error: validation.error
    });
  }

  try {
    await questService.assignQuest({
      user,
      childId,
      questDefinitionId: validation.value.questDefinitionId,
      day: validation.value.day
    });
    res.redirect(`/quest?childId=${encodeURIComponent(childId)}&message=Quest assigned&tab=${validation.value.day}`);
  } catch (error) {
    return redirectErrorWithParams(res, '/quest', {
      childId,
      error: error.message || FALLBACK_ERROR,
      tab: validation.value.day
    });
  }
};

/**
 * postRemoveAssignedQuest: executes this module action.
 */
exports.postRemoveAssignedQuest = async (req, res) => {
  const user = req.session.user;
  const childId = req.body.childId;
  const dailyQuestId = req.body.dailyQuestId;
  const tab = req.body.tab === 'tomorrow' ? 'tomorrow' : 'today';

  if (!childId) {
    return redirectErrorWithParams(res, '/quest', {
      error: 'Child not selected'
    });
  }

  if (!dailyQuestId) {
    return redirectErrorWithParams(res, '/quest', {
      childId,
      error: 'Task not found'
    });
  }

  try {
    await questService.removeAssignedQuest({ user, childId, dailyQuestId });
    res.redirect(`/quest?childId=${encodeURIComponent(childId)}&tab=${tab}&message=Task removed`);
  } catch (error) {
    return redirectErrorWithParams(res, '/quest', {
      childId,
      tab,
      error: error.message || FALLBACK_ERROR
    });
  }
};

/**
 * postReviewConfirm: executes this module action.
 */
exports.postReviewConfirm = async (req, res) => {
  const user = req.session.user;
  const validation = validateReview(req.body);
  const childId = (req.body.childId || '').trim();
  const tab = req.body.tab === 'tomorrow' ? 'tomorrow' : 'today';
  if (!validation.ok) {
    if (childId && childId !== 'all') {
      return redirectErrorWithParams(res, '/quest', {
        childId,
        tab,
        error: validation.error
      });
    }
    return redirectErrorWithParams(res, '/quest', {
      childId: 'all',
      panel: 'approval',
      error: validation.error
    });
  }

  try {
    await questService.reviewQuest({
      questId: req.params.id,
      result: validation.value.result,
      familyId: user.familyId
    });
    if (childId && childId !== 'all') {
      return res.redirect(`/quest?childId=${encodeURIComponent(childId)}&tab=${tab}&message=Review saved`);
    }
    res.redirect('/quest?childId=all&panel=approval&message=Review saved');
  } catch (error) {
    if (childId && childId !== 'all') {
      return redirectErrorWithParams(res, '/quest', {
        childId,
        tab,
        error: error.message || FALLBACK_ERROR
      });
    }
    return redirectErrorWithParams(res, '/quest', {
      childId: 'all',
      panel: 'approval',
      error: error.message || FALLBACK_ERROR
    });
  }
};

/**
 * getQuestToday: executes this module action.
 */
exports.getQuestToday = async (req, res) => {
  return exports.getQuestHome(req, res);
};

/**
 * getQuestTomorrow: executes this module action.
 */
exports.getQuestTomorrow = async (req, res) => {
  return exports.getQuestHome(req, res);
};

/**
 * getQuestDetail: executes this module action.
 */
exports.getQuestDetail = async (req, res) => {
  const user = req.session.user;
  const dailyQuestId = req.params.dailyQuestId;
  const task = await questService.getQuestDetail(user.id, dailyQuestId);

  if (!task) {
    return redirectError(res, '/quest', 'Task not found');
  }

  const { getServerDateString } = require('../utils/dateUtils');
  res.render('pages/quest/quest_detail', buildQuestDetailViewModel({
    user,
    task,
    today: getServerDateString(0),
    query: req.query
  }));
};

/**
 * postQuestSubmit: executes this module action.
 */
exports.postQuestSubmit = async (req, res) => {
  const user = req.session.user;
  const dailyQuestId = req.params.dailyQuestId;

  try {
    await questService.submitQuest(user.id, dailyQuestId);
    res.redirect('/quest?message=Task submitted');
  } catch (error) {
    return redirectError(res, '/quest', error.message || FALLBACK_ERROR);
  }
};
