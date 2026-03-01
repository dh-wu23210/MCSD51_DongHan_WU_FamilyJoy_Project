/** Module: questValidator. Handles questValidator responsibilities. */

const { QUEST_CATEGORIES } = require('../constants/questCategories');

/**
 * validateQuestDefinition: executes this module action.
 */
function validateQuestDefinition(body) {
  const name = (body.name || '').trim();
  const description = (body.description || '').trim();
  const category = (body.category || '').trim();
  const baseCrystalsRaw = (body.baseCrystals || '').toString().trim();
  const baseCrystals = baseCrystalsRaw === '' ? 1 : Number(baseCrystalsRaw);
  if (!name) return { ok: false, error: 'Quest name is required' };
  if (!QUEST_CATEGORIES.includes(category)) return { ok: false, error: 'Invalid category' };
  if (Number.isNaN(baseCrystals) || !Number.isInteger(baseCrystals) || baseCrystals < 1 || baseCrystals > 100) {
    return { ok: false, error: 'Base crystals must be an integer between 1 and 100' };
  }
  return { ok: true, value: { name, description, category, baseCrystals } };
}

/**
 * validateAssignQuest: executes this module action.
 */
function validateAssignQuest(body) {
  const questDefinitionId = (body.questDefinitionId || '').trim();
  const day = body.day === 'tomorrow' ? 'tomorrow' : 'today';
  if (!questDefinitionId) return { ok: false, error: 'Select a quest' };
  return { ok: true, value: { questDefinitionId, day } };
}

/**
 * validateReview: executes this module action.
 */
function validateReview(body) {
  const result = (body.result || '').trim();
  if (!['complete', 'incomplete'].includes(result)) return { ok: false, error: 'Invalid result' };
  return { ok: true, value: { result } };
}

module.exports = {
  validateQuestDefinition,
  validateAssignQuest,
  validateReview,
  CATEGORY_LIST: QUEST_CATEGORIES
};
