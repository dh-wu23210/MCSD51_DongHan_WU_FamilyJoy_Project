/** Module: userService. Handles userService responsibilities. */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userRepo = require('../repositories/userRepo');

/**
 * normalizeRole: executes this module action.
 */
function normalizeRole(role) {
  return (role || '').toLowerCase() === 'child' ? 'child' : 'parent';
}

/**
 * generateUsername: executes this module action.
 */
function generateUsername(familyCode, username, existingUsernames) {
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (!cleanUsername) {
    throw new Error('Username must contain at least one alphanumeric character');
  }

  let finalUsername = `${familyCode}_${cleanUsername}`;
  let sequence = 2;

  while (existingUsernames.includes(finalUsername)) {
    finalUsername = `${familyCode}_${cleanUsername}${sequence}`;
    sequence++;
  }

  return finalUsername;
}

/**
 * getInitialPassword: executes this module action.
 */
function getInitialPassword(familyCode) {
  return familyCode;
}

/**
 * createMember: executes this module action.
 */
async function createMember({ familyId, familyCode, customUsername, role }) {
  const existingUsers = await userRepo.listUsernamesByFamily(familyId);
  const existingUsernames = existingUsers.map((u) => u.username);
  const username = generateUsername(familyCode, customUsername, existingUsernames);
  const initialPassword = getInitialPassword(familyCode);
  const passwordHash = await bcrypt.hash(initialPassword, 10);
  const userId = uuidv4();

  await userRepo.insertUser({
    id: userId,
    familyId,
    username,
    passwordHash,
    nickname: 'NICKNAME',
    role,
    isAdmin: false,
    isInitialPassword: true
  });

  return { userId, username };
}

/**
 * resetMemberPassword: executes this module action.
 */
async function resetMemberPassword({ memberId, familyCode }) {
  const initialPassword = getInitialPassword(familyCode);
  const passwordHash = await bcrypt.hash(initialPassword, 10);
  await userRepo.updatePassword(memberId, passwordHash, true);
}

/**
 * updateNickname: executes this module action.
 */
async function updateNickname(userId, nickname) {
  await userRepo.updateNickname(userId, nickname);
}

/**
 * updateUsername: executes this module action.
 */
async function updateUsername(userId, newUsername) {
  await userRepo.updateUsername(userId, newUsername);
}

/**
 * updateUsernameWithFamily: executes this module action.
 */
async function updateUsernameWithFamily({ userId, familyCode, customUsername }) {
  if (!familyCode) {
    const err = new Error('Family code not found');
    err.isUserFacing = true;
    throw err;
  }

  const newUsername = `${familyCode}_${customUsername}`;
  const existing = await userRepo.findByUsername(newUsername);

  if (existing && existing.id !== userId) {
    const err = new Error('Username already exists');
    err.isUserFacing = true;
    throw err;
  }

  await userRepo.updateUsername(userId, newUsername);
  return { username: newUsername };
}

/**
 * changePasswordWithPolicy: executes this module action.
 */
async function changePasswordWithPolicy({ userId, isInitialPassword, currentPassword, newPassword }) {
  const dbUser = await userRepo.findById(userId);
  if (!dbUser) {
    const err = new Error('Operation failed');
    err.isUserFacing = true;
    throw err;
  }

  if (!isInitialPassword) {
    const match = await bcrypt.compare(currentPassword, dbUser.password_hash);
    if (!match) {
      const err = new Error('Current password is incorrect.');
      err.isUserFacing = true;
      throw err;
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userRepo.updatePassword(userId, passwordHash, false);
}

/**
 * listActiveChildrenByFamily: executes this module action.
 */
async function listActiveChildrenByFamily(familyId) {
  return userRepo.listActiveChildrenByFamily(familyId);
}

/**
 * findById: executes this module action.
 */
async function findById(userId) {
  return userRepo.findById(userId);
}

/**
 * findByUsername: executes this module action.
 */
async function findByUsername(username) {
  return userRepo.findByUsername(username);
}

module.exports = {
  normalizeRole,
  generateUsername,
  getInitialPassword,
  createMember,
  resetMemberPassword,
  updateNickname,
  updateUsername,
  updateUsernameWithFamily,
  changePasswordWithPolicy,
  listActiveChildrenByFamily,
  findById,
  findByUsername
};
