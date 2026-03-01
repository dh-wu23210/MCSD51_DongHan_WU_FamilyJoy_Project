/** Module: authService. Handles authService responsibilities. */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const familyRepo = require('../repositories/familyRepo');
const userRepo = require('../repositories/userRepo');
const sessionRepo = require('../repositories/sessionRepo');
const userService = require('./userService');
const db = require('../models/db-connector');

/**
 * login: executes this module action.
 */
async function login(username, password) {
  const user = await userRepo.findByUsername(username);
  if (!user) {
    const err = new Error('Username or password incorrect');
    err.isUserFacing = true;
    throw err;
  }

  if (user.status === 'disabled' || user.status === 'Disabled') {
    const err = new Error('Account has been disabled. Please contact your family admin.');
    err.isUserFacing = true;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) {
    const err = new Error('Username or password incorrect');
    err.isUserFacing = true;
    throw err;
  }

  const rawRole = (user.role || '').toLowerCase();
  const normalizedRole = userService.normalizeRole(rawRole);
  const isAdmin = rawRole === 'family_admin' || user.is_admin === 1 || user.is_admin === '1' || user.is_admin === true;
  const familyCode = await familyRepo.getFamilyCodeById(user.family_id);
  const isInitial = user.is_initial_password === 1 || user.is_initial_password === '1' || user.is_initial_password === true;

  return {
    user,
    sessionUser: {
      id: user.id,
      name: user.username,
      email: user.email || null,
      familyId: user.family_id,
      familyCode,
      role: normalizedRole,
      isAdmin,
      nickname: user.nickname || 'NICKNAME',
      isInitialPassword: isInitial,
      crystalBalance: typeof user.crystal_balance === 'number' ? user.crystal_balance : 0
    }
  };
}

/**
 * createFamily: executes this module action.
 */
async function createFamily({ familyName, familyCode, customUsername, password }) {
  const familyExists = await familyRepo.familyCodeExists(familyCode);
  if (familyExists) {
    throw new Error(`Family code "${familyCode}" is already taken. Please choose another.`);
  }

  const familyId = uuidv4();
  const userId = uuidv4();
  const username = userService.generateUsername(familyCode, customUsername, []);

  const passwordHash = await bcrypt.hash(password, 10);
  const conn = await db.promise.getConnection();
  try {
    await conn.beginTransaction();
    await familyRepo.insertFamily({ id: familyId, name: familyName, familyCode }, conn);
    await userRepo.insertUser({
      id: userId,
      familyId,
      username,
      passwordHash,
      nickname: 'NICKNAME',
      role: 'parent',
      isAdmin: true,
      isInitialPassword: false
    }, conn);
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return {
    user: {
      id: userId,
      name: username,
      email: null,
      familyId,
      familyCode,
      role: 'parent',
      isAdmin: true,
      nickname: 'NICKNAME',
      crystalBalance: 0
    }
  };
}

/**
 * syncSessionUserId: executes this module action.
 */
async function syncSessionUserId(sessionId, userId) {
  return sessionRepo.updateSessionUserId(sessionId, userId);
}

module.exports = {
  login,
  createFamily,
  syncSessionUserId
};
