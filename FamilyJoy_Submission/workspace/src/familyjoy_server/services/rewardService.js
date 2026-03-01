/** Module: rewardService. Handles rewardService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const rewardRepo = require('../repositories/rewardRepo');
const rewardAssignmentRepo = require('../repositories/rewardAssignmentRepo');
const accessGuard = require('./accessGuard');

const ICON_KEYS = ['gift', 'book', 'game', 'sports', 'snack', 'outdoor', 'music', 'art', 'home', 'star'];

/**
 * getIconKeys: executes this module action.
 */
function getIconKeys() {
  return ICON_KEYS;
}

/**
 * listRewardsWithAssignments: executes this module action.
 */
async function listRewardsWithAssignments(familyId) {
  const rewards = await rewardRepo.listByFamily(familyId);
  const activeRewards = (rewards || []).filter((reward) => reward.status === 'active');
  const assignments = await rewardAssignmentRepo.listAssignmentsByFamily(familyId);
  const assignmentMap = assignments.reduce((acc, row) => {
    const key = `${row.reward_id}:${row.child_id}`;
    acc[key] = row.quantity;
    return acc;
  }, {});
  return { rewards: activeRewards, assignmentMap };
}

/**
 * createReward: executes this module action.
 */
async function createReward({ familyId, name, description, iconKey, price }) {
  await rewardRepo.insertReward({
    id: uuidv4(),
    familyId,
    name,
    description,
    iconKey,
    price
  });
}

/**
 * updateReward: executes this module action.
 */
async function updateReward({ id, familyId, name, description, iconKey, price }) {
  await rewardRepo.updateReward({
    id,
    familyId,
    name,
    description,
    iconKey,
    price
  });
}

/**
 * toggleReward: executes this module action.
 */
async function toggleReward({ id, familyId }) {
  const reward = await rewardRepo.getByIdAndFamily(id, familyId);
  if (!reward) throw new Error('Reward not found');
  const next = reward.status === 'active' ? 'inactive' : 'active';
  await rewardRepo.updateRewardStatus(id, familyId, next);
  return { status: next };
}

/**
 * deleteReward: executes this module action.
 */
async function deleteReward({ id, familyId }) {
  const reward = await rewardRepo.getByIdAndFamily(id, familyId);
  if (!reward) throw new Error('Reward not found');
  await rewardRepo.updateRewardStatus(id, familyId, 'inactive');
  return { status: 'inactive' };
}

/**
 * assignRewardToChild: executes this module action.
 */
async function assignRewardToChild({ familyId, rewardId, childId }) {
  await accessGuard.assertRewardInFamily(rewardId, familyId);
  await accessGuard.assertActiveChildInFamily(childId, familyId);
  await rewardAssignmentRepo.upsertAssignment({ rewardId, childId, quantity: -1 });
}

/**
 * unassignRewardFromChild: executes this module action.
 */
async function unassignRewardFromChild({ familyId, rewardId, childId }) {
  await accessGuard.assertRewardInFamily(rewardId, familyId);
  await accessGuard.assertActiveChildInFamily(childId, familyId);
  await rewardAssignmentRepo.deleteAssignment({ rewardId, childId });
}

module.exports = {
  getIconKeys,
  listRewardsWithAssignments,
  createReward,
  updateReward,
  toggleReward,
  deleteReward,
  assignRewardToChild,
  unassignRewardFromChild
};
