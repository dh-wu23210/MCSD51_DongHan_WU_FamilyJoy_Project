/** Module: wishService. Handles wishService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const db = require('../models/db-connector');
const wishRepo = require('../repositories/wishRepo');
const backpackRepo = require('../repositories/backpackRepo');
const userRepo = require('../repositories/userRepo');
const mailboxService = require('./mailboxService');
const { getServerDateString } = require('../utils/dateUtils');
const accessGuard = require('./accessGuard');

const SLOT_ORDER = ['A', 'B', 'C', 'D', 'E'];

/**
 * getNextAvailableSlot: executes this module action.
 */
function getNextAvailableSlot(usedSlots) {
  const used = new Set(usedSlots || []);
  return SLOT_ORDER.find((slot) => !used.has(slot)) || null;
}

/**
 * listChildOpenWishes: executes this module action.
 */
async function listChildOpenWishes(childId) {
  return wishRepo.listOpenByChild(childId);
}

/**
 * listChildOpenWishesForFamily: executes this module action.
 */
async function listChildOpenWishesForFamily(childId, familyId) {
  await accessGuard.assertChildInFamily(childId, familyId);
  return wishRepo.listOpenByChild(childId);
}

/**
 * listFamilyOpenWishes: executes this module action.
 */
async function listFamilyOpenWishes(familyId) {
  return wishRepo.listOpenByFamily(familyId);
}

/**
 * createWish: executes this module action.
 */
async function createWish({ childId, rewardId }) {
  const conn = await db.promise.getConnection();
  try {
    await conn.beginTransaction();

    const backpackItem = await backpackRepo.getItemForUpdate(conn, childId, rewardId);
    if (!backpackItem || backpackItem.quantity <= 0) {
      await conn.rollback();
      throw new Error('Item not available');
    }

    const usedSlots = await wishRepo.listOpenSlots(childId, conn);
    const slot = getNextAvailableSlot(usedSlots);
    if (!slot) {
      await conn.rollback();
      throw new Error('Wish grid full');
    }

    const child = await userRepo.findById(childId);
    if (!child) {
      await conn.rollback();
      throw new Error('Invalid child');
    }

    await wishRepo.insertWish(conn, {
      id: uuidv4(),
      childId,
      familyId: child.family_id,
      rewardId,
      slotCode: slot
    });

    await backpackRepo.decrementItem(conn, childId, rewardId);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * acceptWish: executes this module action.
 */
async function acceptWish({ parentId, wishId }) {
  const conn = await db.promise.getConnection();
  try {
    await conn.beginTransaction();

    const parent = await userRepo.findById(parentId);
    if (!parent || parent.role !== 'parent') {
      await conn.rollback();
      throw new Error('Invalid parent');
    }

    const wish = await wishRepo.getWishForUpdate(conn, wishId);
    if (!wish) {
      await conn.rollback();
      throw new Error('Wish not found');
    }
    if (wish.status !== 'open') {
      await conn.rollback();
      throw new Error('Wish already resolved');
    }
    if (wish.family_id && parent.family_id && wish.family_id !== parent.family_id) {
      await conn.rollback();
      throw new Error('Forbidden');
    }

    await wishRepo.acceptWish(conn, wishId);

    const childName = wish.nickname || wish.username || 'Child';
    const date = getServerDateString(0);
    const title = 'Wish Accepted';
    const message = `Wish for ${childName} was accepted on ${date}.`;

    await mailboxService.addCustomNotification(conn, wish.child_id, title, message, 'wish_accepted', wishId);
    await mailboxService.addCustomNotification(conn, parentId, title, message, 'wish_accepted', wishId);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  listChildOpenWishes,
  listChildOpenWishesForFamily,
  listFamilyOpenWishes,
  createWish,
  acceptWish
};
