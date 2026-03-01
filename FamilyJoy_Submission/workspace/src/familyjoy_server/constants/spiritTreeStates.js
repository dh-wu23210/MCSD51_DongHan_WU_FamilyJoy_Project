/** Module: spiritTreeStates. Handles spiritTreeStates responsibilities. */

const { getAssetPath } = require('./assets');

const SPIRIT_TREE_STATES = Object.freeze([
  'withered',
  'sicked',
  'healthy'
]);

/**
 * normalizeSpiritTreeState: executes this module action.
 */
function normalizeSpiritTreeState(state) {
  const next = String(state || '').toLowerCase();
  if (SPIRIT_TREE_STATES.includes(next)) return next;
  return 'withered';
}

/**
 * getSpiritTreeStateByCompletionRate: executes this module action.
 */
function getSpiritTreeStateByCompletionRate(rate) {
  const safeRate = Number.isFinite(Number(rate)) ? Number(rate) : 0;
  if (safeRate <= 40) return 'withered';
  if (safeRate <= 80) return 'sicked';
  return 'healthy';
}

/**
 * getSpiritTreeImageByState: executes this module action.
 */
function getSpiritTreeImageByState(state) {
  const normalized = normalizeSpiritTreeState(state);
  return getAssetPath(`spiritTree.${normalized}`, '/assets/spirit_tree_withered.png');
}

module.exports = {
  SPIRIT_TREE_STATES,
  normalizeSpiritTreeState,
  getSpiritTreeStateByCompletionRate,
  getSpiritTreeImageByState
};
