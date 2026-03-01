/** Module: familyService. Handles familyService responsibilities. */

const familyRepo = require('../repositories/familyRepo');
const userRepo = require('../repositories/userRepo');
const sessionRepo = require('../repositories/sessionRepo');
const userService = require('./userService');

/**
 * getFamilyInfo: executes this module action.
 */
async function getFamilyInfo(familyId) {
  return familyRepo.getFamilyById(familyId);
}

/**
 * getMembersWithCountdown: executes this module action.
 */
async function getMembersWithCountdown(familyId) {
  const members = await userRepo.listMembersByFamily(familyId);
  return (members || []).map((member) => {
    const role = (member.role || '').toLowerCase();
    let daysRemaining = null;
    if (member.status === 'disabled' && member.delete_after) {
      const now = new Date();
      const deleteAt = new Date(member.delete_after);
      const diffMs = deleteAt - now;
      daysRemaining = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
    }
    return {
      ...member,
      role: role === 'child' ? 'child' : 'parent',
      deleteCountdownDays: daysRemaining
    };
  });
}

/**
 * addMember: executes this module action.
 */
async function addMember({ familyId, familyCode, customUsername, role }) {
  return userService.createMember({ familyId, familyCode, customUsername, role });
}

/**
 * resetMemberPassword: executes this module action.
 */
async function resetMemberPassword({ memberId, familyId, familyCode }) {
  const member = await userRepo.getMemberByIdAndFamilyBasic(memberId, familyId);
  if (!member) {
    throw new Error('Member not found');
  }
  if (member.is_admin === 1) {
    throw new Error('Cannot reset admin password');
  }
  await userService.resetMemberPassword({ memberId, familyCode });
}

/**
 * disableMember: executes this module action.
 */
async function disableMember({ memberId, familyId }) {
  const member = await userRepo.getMemberByIdAndFamily(memberId, familyId);
  if (!member) {
    throw new Error('Member not found');
  }
  if (member.is_admin === 1) {
    throw new Error('Cannot delete family admin');
  }
  await userRepo.disableMember(memberId);
  await sessionRepo.deleteSessionsByUserId(memberId);
}

/**
 * restoreMember: executes this module action.
 */
async function restoreMember({ memberId, familyId }) {
  const member = await userRepo.getMemberByIdAndFamily(memberId, familyId);
  if (!member) {
    throw new Error('Member not found');
  }
  await userRepo.restoreMember(memberId);
}

module.exports = {
  getFamilyInfo,
  getMembersWithCountdown,
  addMember,
  resetMemberPassword,
  disableMember,
  restoreMember
};
