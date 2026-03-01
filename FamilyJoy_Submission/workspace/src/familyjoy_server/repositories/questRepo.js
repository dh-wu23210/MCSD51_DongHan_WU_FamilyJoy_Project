/** Module: questRepo. Handles questRepo responsibilities. */

const db = require('../models/db-connector');

/**
 * getDefinitionsByFamily: executes this module action.
 */
async function getDefinitionsByFamily(familyId) {
  const [rows] = await db.promise.query(
    "SELECT id, name, description, category, status, base_crystals FROM quest_definitions WHERE family_id = ? AND status = 'active' ORDER BY created_at DESC",
    [familyId]
  );
  return rows || [];
}

/**
 * getActiveDefinitionsByFamily: executes this module action.
 */
async function getActiveDefinitionsByFamily(familyId) {
  const [rows] = await db.promise.query(
    "SELECT id, name, category, base_crystals FROM quest_definitions WHERE family_id = ? AND status = 'active' ORDER BY created_at DESC",
    [familyId]
  );
  return rows || [];
}

/**
 * getDefinitionByIdAndFamily: executes this module action.
 */
async function getDefinitionByIdAndFamily(id, familyId) {
  const [rows] = await db.promise.query(
    'SELECT id, family_id, status FROM quest_definitions WHERE id = ? AND family_id = ?',
    [id, familyId]
  );
  return rows?.[0] ?? null;
}

/**
 * insertDefinition: executes this module action.
 */
async function insertDefinition(def) {
  const { id, familyId, name, description, category, baseCrystals } = def;
  await db.promise.query(
    'INSERT INTO quest_definitions (id, family_id, name, description, category, icon, base_crystals, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
    [id, familyId, name, description || null, category, null, baseCrystals || 0, 'active']
  );
}

/**
 * updateDefinition: executes this module action.
 */
async function updateDefinition(def) {
  const { id, familyId, name, description, category, baseCrystals } = def;
  await db.promise.query(
    'UPDATE quest_definitions SET name = ?, description = ?, category = ?, base_crystals = ? WHERE id = ? AND family_id = ?',
    [name, description || null, category, baseCrystals || 0, id, familyId]
  );
}

/**
 * archiveDefinition: executes this module action.
 */
async function archiveDefinition(id, familyId) {
  await db.promise.query(
    "UPDATE quest_definitions SET status = 'archived' WHERE id = ? AND family_id = ?",
    [id, familyId]
  );
}

/**
 * getDailyQuestsByChildDate: executes this module action.
 */
async function getDailyQuestsByChildDate(childId, targetDate) {
  const [rows] = await db.promise.query(
    'SELECT dq.id, dq.quest_definition_id, dq.status, dq.target_date, qd.name, qd.description, qd.category, qd.base_crystals FROM daily_quests dq JOIN quest_definitions qd ON dq.quest_definition_id = qd.id WHERE dq.child_id = ? AND dq.target_date = ? ORDER BY dq.created_at DESC',
    [childId, targetDate]
  );
  return rows || [];
}

/**
 * insertDailyQuest: executes this module action.
 */
async function insertDailyQuest(row) {
  const { id, childId, questDefinitionId, targetDate, assignedBy } = row;
  await db.promise.query(
    'INSERT INTO daily_quests (id, child_id, quest_definition_id, target_date, status, assigned_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
    [id, childId, questDefinitionId, targetDate, 'assigned', assignedBy]
  );
}

/**
 * findDailyQuest: executes this module action.
 */
async function findDailyQuest(childId, questDefinitionId, targetDate) {
  const [rows] = await db.promise.query(
    'SELECT id FROM daily_quests WHERE child_id = ? AND quest_definition_id = ? AND target_date = ?',
    [childId, questDefinitionId, targetDate]
  );
  return rows?.[0] ?? null;
}

/**
 * getDailyQuestByIdForChild: executes this module action.
 */
async function getDailyQuestByIdForChild(dailyQuestId, childId) {
  const [rows] = await db.promise.query(
    'SELECT id, status, target_date FROM daily_quests WHERE id = ? AND child_id = ?',
    [dailyQuestId, childId]
  );
  return rows?.[0] ?? null;
}

/**
 * getDailyQuestDetailForChild: executes this module action.
 */
async function getDailyQuestDetailForChild(dailyQuestId, childId) {
  const [rows] = await db.promise.query(
    'SELECT dq.id, dq.status, dq.target_date, qd.name, qd.description, qd.category, qd.base_crystals FROM daily_quests dq JOIN quest_definitions qd ON dq.quest_definition_id = qd.id WHERE dq.id = ? AND dq.child_id = ?',
    [dailyQuestId, childId]
  );
  return rows?.[0] ?? null;
}

/**
 * deleteDailyQuest: executes this module action.
 */
async function deleteDailyQuest(dailyQuestId, childId) {
  await db.promise.query('DELETE FROM daily_quests WHERE id = ? AND child_id = ?', [dailyQuestId, childId]);
}

/**
 * updateDailyQuestStatus: executes this module action.
 */
async function updateDailyQuestStatus(dailyQuestId, status) {
  await db.promise.query('UPDATE daily_quests SET status = ? WHERE id = ?', [status, dailyQuestId]);
}

/**
 * updateDailyQuestStatusIfCurrent: executes this module action.
 */
async function updateDailyQuestStatusIfCurrent(dailyQuestId, currentStatus, nextStatus) {
  const [result] = await db.promise.query(
    'UPDATE daily_quests SET status = ? WHERE id = ? AND status = ?',
    [nextStatus, dailyQuestId, currentStatus]
  );
  return Number(result?.affectedRows || 0);
}

/**
 * getSubmittedQuestsByFamily: executes this module action.
 */
async function getSubmittedQuestsByFamily(familyId) {
  const [rows] = await db.promise.query(
    "SELECT dq.id, dq.target_date, dq.status, qd.name, qd.category, u.id AS child_id, u.nickname, u.username FROM daily_quests dq JOIN quest_definitions qd ON dq.quest_definition_id = qd.id JOIN users u ON dq.child_id = u.id WHERE qd.family_id = ? AND dq.status = 'submitted' ORDER BY u.created_at, dq.target_date",
    [familyId]
  );
  return rows || [];
}

/**
 * getSubmittedQuestForFamily: executes this module action.
 */
async function getSubmittedQuestForFamily(dailyQuestId, familyId) {
  const [rows] = await db.promise.query(
    "SELECT dq.id FROM daily_quests dq JOIN quest_definitions qd ON dq.quest_definition_id = qd.id WHERE dq.id = ? AND qd.family_id = ? AND dq.status = 'submitted'",
    [dailyQuestId, familyId]
  );
  return rows?.[0] ?? null;
}

/**
 * getQuestRewardInfo: executes this module action.
 */
async function getQuestRewardInfo(dailyQuestId, familyId) {
  const [rows] = await db.promise.query(
    "SELECT dq.id, dq.status, dq.child_id, qd.base_crystals, qd.name AS quest_name FROM daily_quests dq JOIN quest_definitions qd ON dq.quest_definition_id = qd.id WHERE dq.id = ? AND qd.family_id = ?",
    [dailyQuestId, familyId]
  );
  return rows?.[0] ?? null;
}

/**
 * getDailyQuestStatusById: executes this module action.
 */
async function getDailyQuestStatusById(dailyQuestId) {
  const [rows] = await db.promise.query(
    'SELECT status FROM daily_quests WHERE id = ?',
    [dailyQuestId]
  );
  return rows?.[0]?.status ?? null;
}

/**
 * getDailyQuestByIdForChildAssign: executes this module action.
 */
async function getDailyQuestByIdForChildAssign(dailyQuestId, childId) {
  const [rows] = await db.promise.query(
    'SELECT status FROM daily_quests WHERE id = ? AND child_id = ?',
    [dailyQuestId, childId]
  );
  return rows?.[0] ?? null;
}

/**
 * deleteDailyQuestsByUser: executes this module action.
 */
async function deleteDailyQuestsByUser(userId) {
  await db.promise.query('DELETE FROM daily_quests WHERE child_id = ? OR assigned_by = ?', [userId, userId]);
}

/**
 * getDailyQuestsByChildDateRange: executes this module action.
 */
async function getDailyQuestsByChildDateRange(childId, startDate, endDate) {
  const [rows] = await db.promise.query(
    `SELECT dq.id, dq.child_id, dq.status, dq.target_date, qd.name, qd.base_crystals
     FROM daily_quests dq
     JOIN quest_definitions qd ON dq.quest_definition_id = qd.id
     WHERE dq.child_id = ? AND dq.target_date BETWEEN ? AND ?
     ORDER BY dq.target_date ASC`,
    [childId, startDate, endDate]
  );
  return rows || [];
}

/**
 * getDailyQuestsByFamilyDateRange: executes this module action.
 */
async function getDailyQuestsByFamilyDateRange(familyId, startDate, endDate) {
  const [rows] = await db.promise.query(
    `SELECT dq.id, dq.child_id, dq.status, dq.target_date, qd.name, qd.base_crystals
     FROM daily_quests dq
     JOIN quest_definitions qd ON dq.quest_definition_id = qd.id
     WHERE qd.family_id = ? AND dq.target_date BETWEEN ? AND ?
     ORDER BY dq.target_date ASC`,
    [familyId, startDate, endDate]
  );
  return rows || [];
}

module.exports = {
  getDefinitionsByFamily,
  getActiveDefinitionsByFamily,
  getDefinitionByIdAndFamily,
  insertDefinition,
  updateDefinition,
  archiveDefinition,
  getDailyQuestsByChildDate,
  insertDailyQuest,
  findDailyQuest,
  getDailyQuestByIdForChild,
  getDailyQuestDetailForChild,
  deleteDailyQuest,
  updateDailyQuestStatus,
  updateDailyQuestStatusIfCurrent,
  getSubmittedQuestsByFamily,
  getSubmittedQuestForFamily,
  getQuestRewardInfo,
  getDailyQuestStatusById,
  getDailyQuestByIdForChildAssign,
  deleteDailyQuestsByUser,
  getDailyQuestsByChildDateRange,
  getDailyQuestsByFamilyDateRange
};
