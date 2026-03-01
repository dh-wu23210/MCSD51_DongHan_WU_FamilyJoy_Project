/** Module: wishController. Handles wishController responsibilities. */

const wishService = require('../services/wishService');
const { applyIconClass } = require('../utils/iconUtils');
const FALLBACK_ERROR = 'Operation failed';

/**
 * postCreateWish: executes this module action.
 */
exports.postCreateWish = async (req, res) => {
  const user = req.session.user;
  const rewardId = req.body.rewardId;
  if (!rewardId) {
    return res.status(400).json({ ok: false, error: 'Reward not found' });
  }
  try {
    await wishService.createWish({ childId: user.id, rewardId });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || FALLBACK_ERROR });
  }
};

/**
 * postAcceptWish: executes this module action.
 */
exports.postAcceptWish = async (req, res) => {
  const user = req.session.user;
  const wishId = req.params.id;
  if (!wishId) {
    return res.status(400).json({ ok: false, error: 'Wish not found' });
  }
  try {
    await wishService.acceptWish({ parentId: user.id, wishId });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message || FALLBACK_ERROR });
  }
};

/**
 * getChildWishes: executes this module action.
 */
exports.getChildWishes = async (req, res) => {
  const user = req.session.user;
  const wishes = await wishService.listChildOpenWishes(user.id);
  res.json({ wishes: applyIconClass(wishes) });
};

/**
 * getWishesByChild: executes this module action.
 */
exports.getWishesByChild = async (req, res) => {
  const user = req.session.user;
  const childId = req.params.childId;
  try {
    const wishes = await wishService.listChildOpenWishesForFamily(childId, user.familyId);
    res.json({ wishes: applyIconClass(wishes) });
  } catch (error) {
    const status = error.message === 'Forbidden' ? 403 : 400;
    res.status(status).json({ ok: false, error: error.message || FALLBACK_ERROR });
  }
};
