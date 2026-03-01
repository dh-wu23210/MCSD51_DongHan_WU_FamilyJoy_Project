/** Module: rewardValidator. Handles rewardValidator responsibilities. */

const ICON_KEYS = ['gift', 'book', 'game', 'sports', 'snack', 'outdoor', 'music', 'art', 'home', 'star'];

/**
 * validateRewardDefinition: executes this module action.
 */
function validateRewardDefinition(body) {
  const name = (body.name || '').trim();
  const descriptionInput = (body.description || '').trim();
  const description = descriptionInput || 'Magic Gift';
  const iconKey = (body.iconKey || '').trim();
  const priceRaw = (body.price || '').toString().trim();
  const price = Number(priceRaw);

  if (!name) return { ok: false, error: 'Reward name is required' };
  if (name.length > 50) return { ok: false, error: 'Reward name must be 50 characters or less' };
  if (!description) return { ok: false, error: 'Reward description is required' };
  if (description.length > 120) return { ok: false, error: 'Reward description must be 120 characters or less' };
  if (!ICON_KEYS.includes(iconKey)) return { ok: false, error: 'Invalid icon selection' };
  if (Number.isNaN(price) || !Number.isInteger(price) || price < 1 || price > 9999) {
    return { ok: false, error: 'Price must be an integer between 1 and 9999' };
  }
  return { ok: true, value: { name, description, iconKey, price } };
}

/**
 * validateRewardId: executes this module action.
 */
function validateRewardId(body) {
  const rewardId = (body.rewardId || body.id || '').trim();
  if (!rewardId) return { ok: false, error: 'Reward ID is required' };
  return { ok: true, value: { rewardId } };
}

/**
 * validateRewardAssignment: executes this module action.
 */
function validateRewardAssignment(body) {
  const rewardId = (body.rewardId || '').trim();
  const childId = (body.childId || '').trim();
  if (!rewardId) return { ok: false, error: 'Reward is required' };
  if (!childId) return { ok: false, error: 'Child is required' };
  return { ok: true, value: { rewardId, childId } };
}

module.exports = {
  validateRewardDefinition,
  validateRewardId,
  validateRewardAssignment,
  ICON_KEYS
};
