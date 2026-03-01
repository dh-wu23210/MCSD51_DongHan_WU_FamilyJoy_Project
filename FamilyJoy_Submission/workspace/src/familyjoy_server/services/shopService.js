/** Module: shopService. Handles shopService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const db = require('../models/db-connector');
const rewardAssignmentRepo = require('../repositories/rewardAssignmentRepo');
const rewardRepo = require('../repositories/rewardRepo');
const backpackRepo = require('../repositories/backpackRepo');
const userRepo = require('../repositories/userRepo');
const ledgerRepo = require('../repositories/ledgerRepo');
const mailboxService = require('./mailboxService');

/**
 * getChildShopData: executes this module action.
 */
async function getChildShopData(childId) {
  const rewards = await rewardAssignmentRepo.listAssignedRewardsForChild(childId);
  const activeRewards = (rewards || []).filter((reward) => reward.status === 'active');
  return { rewards: activeRewards };
}

/**
 * purchaseReward: executes this module action.
 */
async function purchaseReward({ childId, rewardId }) {
  const conn = await db.promise.getConnection();
  try {
    await conn.beginTransaction();

    const reward = await rewardRepo.getByIdForUpdate(conn, rewardId);
    if (!reward) {
      await conn.rollback();
      throw new Error('Reward not found');
    }

    const assignment = await rewardAssignmentRepo.getAssignmentForUpdate(conn, rewardId, childId);
    if (!assignment) {
      await conn.rollback();
      throw new Error('Reward not assigned');
    }

    const isUnlimited = Number(assignment.quantity) < 0;
    if (!isUnlimited && assignment.quantity <= 0) {
      await conn.rollback();
      throw new Error('Out of stock');
    }

    if (reward.status !== 'active') {
      await conn.rollback();
      throw new Error('Reward inactive');
    }

    const currentBalance = await userRepo.getCrystalBalanceForUpdate(conn, childId);
    if (currentBalance < reward.price) {
      await conn.rollback();
      throw new Error('Insufficient balance');
    }

    const nextBalance = currentBalance - reward.price;
    await userRepo.updateCrystalBalance(conn, childId, nextBalance);
    await backpackRepo.upsertIncrement(conn, childId, rewardId);
    if (!isUnlimited) {
      await rewardAssignmentRepo.decrementQuantity(conn, assignment.id);
    }
    await mailboxService.addCrystalSpendNotification(
      conn,
      childId,
      reward.price,
      rewardId,
      reward.name || 'Reward'
    );

    await conn.commit();
    return { balance: nextBalance };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  getChildShopData,
  purchaseReward
};
