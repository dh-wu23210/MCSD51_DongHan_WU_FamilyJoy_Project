/** Module: backpackService. Handles backpackService responsibilities. */

const backpackRepo = require('../repositories/backpackRepo');

/**
 * listAllItems: executes this module action.
 */
async function listAllItems(userId) {
  return backpackRepo.listAllItems(userId);
}

module.exports = {
  listAllItems
};
