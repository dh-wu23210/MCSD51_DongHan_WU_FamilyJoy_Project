/** Module: walletService. Handles walletService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const db = require('../models/db-connector');
const userRepo = require('../repositories/userRepo');
const ledgerRepo = require('../repositories/ledgerRepo');
const mailboxService = require('./mailboxService');

/**
 * addCrystals: executes this module action.
 */
async function addCrystals(userId, amount, type, sourceId, meta = {}) {
  const conn = await db.promise.getConnection();
  try {
    await conn.beginTransaction();
    const current = await userRepo.getCrystalBalanceForUpdate(conn, userId);
    const next = current + amount;
    await userRepo.updateCrystalBalance(conn, userId, next);
    await ledgerRepo.insertLedger(conn, {
      id: uuidv4(),
      userId,
      amount,
      type,
      sourceId
    });
    if (type === 'quest_reward') {
      await mailboxService.addCrystalEarnNotification(
        conn,
        userId,
        amount,
        sourceId,
        meta.questName || 'Quest'
      );
    }
    await conn.commit();
    return { balance: next };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * spendCrystals: executes this module action.
 */
async function spendCrystals(userId, amount, type, sourceId, meta = {}) {
  const conn = await db.promise.getConnection();
  try {
    await conn.beginTransaction();
    const current = await userRepo.getCrystalBalanceForUpdate(conn, userId);
    if (current < amount) {
      await conn.rollback();
      throw new Error('Insufficient balance');
    }
    const next = current - amount;
    await userRepo.updateCrystalBalance(conn, userId, next);
    await ledgerRepo.insertLedger(conn, {
      id: uuidv4(),
      userId,
      amount: -amount,
      type,
      sourceId
    });
    if (type === 'purchase') {
      await mailboxService.addCrystalSpendNotification(
        conn,
        userId,
        amount,
        sourceId,
        meta.rewardName || 'Reward'
      );
    }
    await conn.commit();
    return { balance: next };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  addCrystals,
  spendCrystals
};
