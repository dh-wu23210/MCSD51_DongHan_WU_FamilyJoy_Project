/** Module: spiritTreeService. Handles spiritTreeService responsibilities. */

const userRepo = require('../repositories/userRepo');
const spiritTreeRepo = require('../repositories/spiritTreeRepo');
const questService = require('./questService');
const { getServerDateString } = require('../utils/dateUtils');
const {
  normalizeSpiritTreeState,
  getSpiritTreeStateByCompletionRate
} = require('../constants/spiritTreeStates');

/**
 * normalizeCompletionRate: executes this module action.
 */
function normalizeCompletionRate(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate)) return 0;
  if (rate < 0) return 0;
  if (rate > 100) return 100;
  return Math.round(rate);
}

/**
 * assertChildInFamily: executes this module action.
 */
async function assertChildInFamily(childId, familyId) {
  const child = await userRepo.getMemberByIdAndFamily(childId, familyId);
  if (!child || child.role !== 'child') {
    throw new Error('Invalid child');
  }
  return child;
}

/**
 * upsertCurrentAndDaily: executes this module action.
 */
async function upsertCurrentAndDaily({
  childId,
  familyId,
  sourceDate,
  completionRate
}) {
  const rate = normalizeCompletionRate(completionRate);
  const state = getSpiritTreeStateByCompletionRate(rate);

  await spiritTreeRepo.upsertCurrent({
    childId,
    familyId,
    state,
    completionRate: rate,
    sourceDate
  });

  await spiritTreeRepo.upsertDailySnapshot({
    childId,
    familyId,
    snapshotDate: sourceDate,
    state,
    completionRate: rate
  });

  return {
    childId,
    familyId,
    state,
    completionRate: rate,
    sourceDate
  };
}

/**
 * ensureChildCurrentFromYesterday: executes this module action.
 */
async function ensureChildCurrentFromYesterday(childId, familyId) {
  await assertChildInFamily(childId, familyId);

  const yesterday = getServerDateString(-1);
  const current = await spiritTreeRepo.getCurrentByChildId(childId);
  if (current && String(current.sourceDate) === yesterday) {
    return current;
  }

  const completionRate = await questService.getChildCompletionRateByDate(childId, yesterday);
  return upsertCurrentAndDaily({
    childId,
    familyId,
    sourceDate: yesterday,
    completionRate
  });
}

/**
 * ensureFamilyCurrentFromYesterday: executes this module action.
 */
async function ensureFamilyCurrentFromYesterday(children, familyId) {
  const childList = Array.isArray(children) ? children : [];
  const currentRows = await spiritTreeRepo.listCurrentByFamilyId(familyId);
  const currentMap = new Map(currentRows.map((row) => [String(row.childId), row]));
  const yesterday = getServerDateString(-1);

  return Promise.all(childList.map(async (child) => {
    const current = currentMap.get(String(child.id));
    if (current && String(current.sourceDate) === yesterday) {
      return current;
    }
    const completionRate = await questService.getChildCompletionRateByDate(child.id, yesterday);
    return upsertCurrentAndDaily({
      childId: child.id,
      familyId,
      sourceDate: yesterday,
      completionRate
    });
  }));
}

/**
 * getChildCurrent: executes this module action.
 */
async function getChildCurrent(childId, familyId) {
  await assertChildInFamily(childId, familyId);
  return spiritTreeRepo.getCurrentByChildId(childId);
}

/**
 * listFamilyCurrent: executes this module action.
 */
async function listFamilyCurrent(familyId) {
  return spiritTreeRepo.listCurrentByFamilyId(familyId);
}

/**
 * upsertChildCurrentManual: executes this module action.
 */
async function upsertChildCurrentManual({
  childId,
  familyId,
  state,
  completionRate,
  sourceDate
}) {
  await assertChildInFamily(childId, familyId);
  const date = sourceDate || getServerDateString(-1);
  const rate = normalizeCompletionRate(completionRate);
  const normalizedState = state
    ? normalizeSpiritTreeState(state)
    : getSpiritTreeStateByCompletionRate(rate);

  await spiritTreeRepo.upsertCurrent({
    childId,
    familyId,
    state: normalizedState,
    completionRate: rate,
    sourceDate: date
  });

  await spiritTreeRepo.upsertDailySnapshot({
    childId,
    familyId,
    snapshotDate: date,
    state: normalizedState,
    completionRate: rate
  });

  return {
    childId,
    familyId,
    state: normalizedState,
    completionRate: rate,
    sourceDate: date
  };
}

/**
 * deleteChildCurrent: executes this module action.
 */
async function deleteChildCurrent(childId, familyId) {
  await assertChildInFamily(childId, familyId);
  return spiritTreeRepo.deleteCurrentByChildId(childId, familyId);
}

/**
 * listChildHistory: executes this module action.
 */
async function listChildHistory(childId, familyId, limit) {
  await assertChildInFamily(childId, familyId);
  return spiritTreeRepo.listDailyByChildId(childId, limit);
}

/**
 * deleteChildHistoryByDate: executes this module action.
 */
async function deleteChildHistoryByDate(childId, familyId, snapshotDate) {
  await assertChildInFamily(childId, familyId);
  return spiritTreeRepo.deleteDailyByChildIdAndDate(childId, familyId, snapshotDate);
}

module.exports = {
  ensureChildCurrentFromYesterday,
  ensureFamilyCurrentFromYesterday,
  getChildCurrent,
  listFamilyCurrent,
  upsertChildCurrentManual,
  deleteChildCurrent,
  listChildHistory,
  deleteChildHistoryByDate
};
