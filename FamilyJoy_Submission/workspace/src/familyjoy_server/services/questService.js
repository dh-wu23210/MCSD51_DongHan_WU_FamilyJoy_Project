/** Module: questService. Handles questService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const questRepo = require('../repositories/questRepo');
const userRepo = require('../repositories/userRepo');
const { getServerDateString, formatDateString } = require('../utils/dateUtils');
const walletService = require('./walletService');
const mailboxService = require('./mailboxService');
const accessGuard = require('./accessGuard');
const { QUEST_CATEGORIES } = require('../constants/questCategories');

/**
 * getCategoryList: executes this module action.
 */
function getCategoryList() {
  return [...QUEST_CATEGORIES];
}

/**
 * getQuestHomeData: executes this module action.
 */
async function getQuestHomeData(user) {
  const children = await userRepo.listActiveChildrenByFamily(user.familyId);
  return { children };
}

/**
 * getQuestBookData: executes this module action.
 */
async function getQuestBookData(familyId) {
  const definitions = await questRepo.getDefinitionsByFamily(familyId);
  return { definitions };
}

/**
 * createQuestDefinition: executes this module action.
 */
async function createQuestDefinition({ familyId, name, description, category, baseCrystals }) {
  const id = uuidv4();
  await questRepo.insertDefinition({ id, familyId, name, description, category, baseCrystals });
}

/**
 * updateQuestDefinition: executes this module action.
 */
async function updateQuestDefinition({ id, familyId, name, description, category, baseCrystals }) {
  await questRepo.updateDefinition({ id, familyId, name, description, category, baseCrystals });
}

/**
 * archiveQuestDefinition: executes this module action.
 */
async function archiveQuestDefinition(id, familyId) {
  await questRepo.archiveDefinition(id, familyId);
}

/**
 * getAssignData: executes this module action.
 */
async function getAssignData(user, childId) {
  const yesterday = getServerDateString(-1);
  const today = getServerDateString(0);
  const tomorrow = getServerDateString(1);

  const children = await userRepo.listActiveChildrenByFamily(user.familyId);
  const activeChild = children.find((child) => child.id === childId) || children[0] || null;

  const definitions = await questRepo.getActiveDefinitionsByFamily(user.familyId);
  const yesterdayTasks = activeChild ? await questRepo.getDailyQuestsByChildDate(activeChild.id, yesterday) : [];
  const todayTasks = activeChild ? await questRepo.getDailyQuestsByChildDate(activeChild.id, today) : [];
  const tomorrowTasks = activeChild ? await questRepo.getDailyQuestsByChildDate(activeChild.id, tomorrow) : [];

  return {
    yesterday,
    today,
    tomorrow,
    children,
    activeChild,
    definitions,
    yesterdayTasks,
    todayTasks,
    tomorrowTasks
  };
}

/**
 * assignQuest: executes this module action.
 */
async function assignQuest({ user, childId, questDefinitionId, day }) {
  const targetDate = day === 'tomorrow' ? getServerDateString(1) : getServerDateString(0);

  await accessGuard.assertActiveChildInFamily(childId, user.familyId);
  await accessGuard.assertActiveQuestDefinitionInFamily(questDefinitionId, user.familyId);

  const existing = await questRepo.findDailyQuest(childId, questDefinitionId, targetDate);
  if (existing) {
    throw new Error('Quest already assigned for that day');
  }

  const id = uuidv4();
  await questRepo.insertDailyQuest({
    id,
    childId,
    questDefinitionId,
    targetDate,
    assignedBy: user.id
  });

}

/**
 * removeAssignedQuest: executes this module action.
 */
async function removeAssignedQuest({ user, childId, dailyQuestId }) {
  const child = await userRepo.getMemberByIdAndFamily(childId, user.familyId);
  if (!child || child.role !== 'child') {
    throw new Error('Invalid child');
  }

  const task = await questRepo.getDailyQuestByIdForChildAssign(dailyQuestId, childId);
  if (!task) {
    throw new Error('Task not found');
  }

  if (task.status !== 'assigned') {
    throw new Error('Only assigned tasks can be removed');
  }

  await questRepo.deleteDailyQuest(dailyQuestId, childId);
}

/**
 * getReviewData: executes this module action.
 */
async function getReviewData(familyId) {
  const rows = await questRepo.getSubmittedQuestsByFamily(familyId);
  const grouped = (rows || []).reduce((acc, row) => {
    const key = row.child_id;
    if (!acc[key]) {
      acc[key] = {
        childId: row.child_id,
        childName: row.nickname || row.username,
        tasks: []
      };
    }
    acc[key].tasks.push(row);
    return acc;
  }, {});
  return Object.values(grouped);
}

/**
 * reviewQuest: executes this module action.
 */
async function reviewQuest({ questId, result, familyId }) {
  const row = await questRepo.getQuestRewardInfo(questId, familyId);
  if (!row) {
    throw new Error('Task not found');
  }

  const affectedRows = await questRepo.updateDailyQuestStatusIfCurrent(questId, 'submitted', result);
  if (affectedRows !== 1) {
    throw new Error('Task cannot be updated');
  }

  if (result === 'complete') {
    const rewardAmount = Number(row.base_crystals || 0);
    await walletService.addCrystals(
      row.child_id,
      rewardAmount,
      'quest_reward',
      questId,
      { questName: row.quest_name || 'Quest' }
    );
  } else if (result === 'incomplete') {
    await mailboxService.addQuestFailedNotification(
      row.child_id,
      questId,
      row.quest_name || 'Quest'
    );
  }
}

/**
 * getChildQuestList: executes this module action.
 */
async function getChildQuestList(user) {
  const today = getServerDateString(0);
  const tomorrow = getServerDateString(1);

  const todayTasks = await questRepo.getDailyQuestsByChildDate(user.id, today);
  const tomorrowTasks = await questRepo.getDailyQuestsByChildDate(user.id, tomorrow);
  return {
    today,
    tomorrow,
    todayTasks,
    tomorrowTasks
  };
}

/**
 * getChildCompletionRateByDate: executes this module action.
 */
async function getChildCompletionRateByDate(childId, targetDate) {
  const tasks = await questRepo.getDailyQuestsByChildDate(childId, targetDate);
  const total = Array.isArray(tasks) ? tasks.length : 0;
  if (total <= 0) return 0;
  const completeCount = tasks.filter((task) => String(task.status) === 'complete').length;
  return Math.round((completeCount / total) * 100);
}

/**
 * getQuestDetail: executes this module action.
 */
async function getQuestDetail(userId, dailyQuestId) {
  const row = await questRepo.getDailyQuestDetailForChild(dailyQuestId, userId);
  if (!row) return null;
  return {
    ...row,
    target_date: formatDateString(row.target_date)
  };
}

/**
 * submitQuest: executes this module action.
 */
async function submitQuest(userId, dailyQuestId) {
  const today = getServerDateString(0);
  const task = await questRepo.getDailyQuestByIdForChild(dailyQuestId, userId);
  if (!task) throw new Error('Task not found');
  if (task.status !== 'assigned') throw new Error('Task cannot be submitted');
  const taskDate = formatDateString(task.target_date);
  if (taskDate !== today) throw new Error('Only today tasks can be submitted');
  await questRepo.updateDailyQuestStatus(dailyQuestId, 'submitted');
}

module.exports = {
  getCategoryList,
  getQuestHomeData,
  getQuestBookData,
  createQuestDefinition,
  updateQuestDefinition,
  archiveQuestDefinition,
  getAssignData,
  assignQuest,
  removeAssignedQuest,
  getReviewData,
  reviewQuest,
  getChildQuestList,
  getChildCompletionRateByDate,
  getQuestDetail,
  submitQuest
};
