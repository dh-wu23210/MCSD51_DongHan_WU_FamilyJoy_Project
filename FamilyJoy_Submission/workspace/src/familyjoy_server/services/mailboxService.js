/** Module: mailboxService. Handles mailboxService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const mailboxRepo = require('../repositories/mailboxRepo');

/**
 * buildEarnMessage: executes this module action.
 */
function buildEarnMessage(amount, questName) {
  return {
    title: 'Quest Completed',
    message: `You earned ${amount} crystals from \"${questName}\".`
  };
}

/**
 * buildSpendMessage: executes this module action.
 */
function buildSpendMessage(amount, rewardName) {
  return {
    title: 'Reward Purchased',
    message: `You spent ${amount} crystals on \"${rewardName}\".`
  };
}

/**
 * buildQuestFailedMessage: executes this module action.
 */
function buildQuestFailedMessage(questName) {
  return {
    title: 'Quest Failed',
    message: `Your quest \"${questName}\" was marked incomplete.`
  };
}

/**
 * addCustomNotification: executes this module action.
 */
async function addCustomNotification(conn, userId, title, message, type, sourceId, amount = 0) {
  await mailboxRepo.insertNotification(conn, {
    id: uuidv4(),
    userId,
    type,
    amount,
    sourceId,
    title,
    message
  });
}

/**
 * addCrystalEarnNotification: executes this module action.
 */
async function addCrystalEarnNotification(conn, userId, amount, sourceId, questName) {
  const { title, message } = buildEarnMessage(amount, questName);
  await mailboxRepo.insertNotification(conn, {
    id: uuidv4(),
    userId,
    type: 'crystal_earn',
    amount,
    sourceId,
    title,
    message
  });
}

/**
 * addCrystalSpendNotification: executes this module action.
 */
async function addCrystalSpendNotification(conn, userId, amount, sourceId, rewardName) {
  const { title, message } = buildSpendMessage(amount, rewardName);
  await mailboxRepo.insertNotification(conn, {
    id: uuidv4(),
    userId,
    type: 'crystal_spend',
    amount,
    sourceId,
    title,
    message
  });
}

/**
 * addQuestFailedNotification: executes this module action.
 */
async function addQuestFailedNotification(userId, sourceId, questName) {
  const { title, message } = buildQuestFailedMessage(questName);
  await mailboxRepo.insertNotificationStandalone({
    id: uuidv4(),
    userId,
    type: 'quest_failed',
    amount: 0,
    sourceId,
    title,
    message
  });
}

/**
 * listByUser: executes this module action.
 */
async function listByUser(userId) {
  return mailboxRepo.listByUser(userId);
}

/**
 * countUnread: executes this module action.
 */
async function countUnread(userId) {
  return mailboxRepo.countUnread(userId);
}

/**
 * markAllRead: executes this module action.
 */
async function markAllRead(userId) {
  await mailboxRepo.markAllRead(userId);
}

/**
 * markReadById: executes this module action.
 */
async function markReadById(userId, mailboxId) {
  await mailboxRepo.markReadById(userId, mailboxId);
}

module.exports = {
  addCrystalEarnNotification,
  addCrystalSpendNotification,
  addQuestFailedNotification,
  addCustomNotification,
  listByUser,
  countUnread,
  markAllRead,
  markReadById
};
