/** Module: spiritTreeController. Handles spiritTreeController responsibilities. */

const spiritTreeService = require('../services/spiritTreeService');
const { normalizeSpiritTreeState } = require('../constants/spiritTreeStates');

/**
 * parseCompletionRate: executes this module action.
 */
function parseCompletionRate(raw) {
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  if (value < 0 || value > 100) return null;
  return Math.round(value);
}

/**
 * getFamilyCurrent: executes this module action.
 */
exports.getFamilyCurrent = async (req, res) => {
  const familyId = req.session.user.familyId;
  const items = await spiritTreeService.listFamilyCurrent(familyId);
  res.json({ items });
};

/**
 * getChildCurrent: executes this module action.
 */
exports.getChildCurrent = async (req, res) => {
  const familyId = req.session.user.familyId;
  const childId = req.params.childId;
  try {
    const item = await spiritTreeService.getChildCurrent(childId, familyId);
    if (!item) {
      return res.status(404).json({ ok: false, error: 'Spirit tree data not found' });
    }
    return res.json({ item });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || 'Operation failed' });
  }
};

/**
 * getMyCurrent: executes this module action.
 */
exports.getMyCurrent = async (req, res) => {
  const user = req.session.user;
  const item = await spiritTreeService.ensureChildCurrentFromYesterday(user.id, user.familyId);
  res.json({ item });
};

/**
 * postSyncYesterday: executes this module action.
 */
exports.postSyncYesterday = async (req, res) => {
  const familyId = req.session.user.familyId;
  const childId = req.params.childId;
  try {
    const item = await spiritTreeService.ensureChildCurrentFromYesterday(childId, familyId);
    return res.json({ ok: true, item });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || 'Operation failed' });
  }
};

/**
 * postUpsertManual: executes this module action.
 */
exports.postUpsertManual = async (req, res) => {
  const familyId = req.session.user.familyId;
  const childId = req.params.childId;
  const completionRate = parseCompletionRate(req.body.completionRate);
  const rawState = typeof req.body.state === 'string' && req.body.state.trim()
    ? req.body.state
    : null;
  if (completionRate === null) {
    return res.status(400).json({ ok: false, error: 'Invalid completionRate (0-100)' });
  }

  try {
    const item = await spiritTreeService.upsertChildCurrentManual({
      childId,
      familyId,
      state: rawState ? normalizeSpiritTreeState(rawState) : null,
      completionRate,
      sourceDate: req.body.sourceDate
    });
    return res.json({ ok: true, item });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || 'Operation failed' });
  }
};

/**
 * deleteChildCurrent: executes this module action.
 */
exports.deleteChildCurrent = async (req, res) => {
  const familyId = req.session.user.familyId;
  const childId = req.params.childId;
  try {
    const affectedRows = await spiritTreeService.deleteChildCurrent(childId, familyId);
    return res.json({ ok: true, affectedRows });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || 'Operation failed' });
  }
};

/**
 * getChildHistory: executes this module action.
 */
exports.getChildHistory = async (req, res) => {
  const familyId = req.session.user.familyId;
  const childId = req.params.childId;
  const limit = Number(req.query.limit || 30);
  try {
    const items = await spiritTreeService.listChildHistory(childId, familyId, limit);
    return res.json({ items });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || 'Operation failed' });
  }
};

/**
 * deleteChildHistoryByDate: executes this module action.
 */
exports.deleteChildHistoryByDate = async (req, res) => {
  const familyId = req.session.user.familyId;
  const childId = req.params.childId;
  const snapshotDate = req.params.snapshotDate;
  if (!snapshotDate) {
    return res.status(400).json({ ok: false, error: 'Missing snapshotDate' });
  }
  try {
    const affectedRows = await spiritTreeService.deleteChildHistoryByDate(childId, familyId, snapshotDate);
    return res.json({ ok: true, affectedRows });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || 'Operation failed' });
  }
};
