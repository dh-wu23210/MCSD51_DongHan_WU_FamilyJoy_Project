/** Module: familyValidator. Handles familyValidator responsibilities. */

function validateAddMember(body) {
  const customUsername = (body.username || '').trim();
  const role = (body.role || 'child').trim();
  if (!customUsername) return { ok: false, error: 'Username is required' };
  if (!['parent', 'child'].includes(role)) return { ok: false, error: 'Invalid role' };
  return { ok: true, value: { customUsername, role } };
}

/**
 * validateMemberId: executes this module action.
 */
function validateMemberId(body) {
  const memberId = (body.memberId || '').trim();
  if (!memberId) return { ok: false, error: 'Member ID is required' };
  return { ok: true, value: { memberId } };
}

module.exports = {
  validateAddMember,
  validateMemberId
};
