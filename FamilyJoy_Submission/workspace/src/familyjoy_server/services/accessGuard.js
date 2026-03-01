/** Module: accessGuard. Handles accessGuard responsibilities. */

const userRepo = require('../repositories/userRepo');
const rewardRepo = require('../repositories/rewardRepo');
const questRepo = require('../repositories/questRepo');

/**
 * assertChildInFamily: executes this module action.
 */
async function assertChildInFamily(childId, familyId) {
  const child = await userRepo.getMemberByIdAndFamily(childId, familyId);
  if (!child || child.role !== 'child') {
    throw new Error('Forbidden');
  }
  return child;
}

/**
 * assertActiveChildInFamily: executes this module action.
 */
async function assertActiveChildInFamily(childId, familyId) {
  const child = await assertChildInFamily(childId, familyId);
  if (child.status !== 'active') {
    throw new Error('Invalid child');
  }
  return child;
}

/**
 * assertRewardInFamily: executes this module action.
 */
async function assertRewardInFamily(rewardId, familyId) {
  const reward = await rewardRepo.getByIdAndFamily(rewardId, familyId);
  if (!reward) {
    throw new Error('Invalid reward');
  }
  return reward;
}

/**
 * assertActiveQuestDefinitionInFamily: executes this module action.
 */
async function assertActiveQuestDefinitionInFamily(questDefinitionId, familyId) {
  const definition = await questRepo.getDefinitionByIdAndFamily(questDefinitionId, familyId);
  if (!definition || definition.status !== 'active') {
    throw new Error('Invalid quest definition');
  }
  return definition;
}

module.exports = {
  assertChildInFamily,
  assertActiveChildInFamily,
  assertRewardInFamily,
  assertActiveQuestDefinitionInFamily
};
