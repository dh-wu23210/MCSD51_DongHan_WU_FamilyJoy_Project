/** Module: analyticsService. Handles analyticsService responsibilities. */

const { v4: uuidv4 } = require('uuid');
const analyticsRepository = require('../repositories/analyticsRepository');

/**
 * recordUserLogin: executes this module action.
 */
async function recordUserLogin({ userId, familyId, loginAt = new Date() }) {
  if (!userId || !familyId) return;
  await analyticsRepository.insertUserLoginEvent({
    id: uuidv4(),
    userId,
    familyId,
    loginAt
  });
}

module.exports = {
  recordUserLogin
};

