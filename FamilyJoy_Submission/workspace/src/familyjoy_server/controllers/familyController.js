/** Module: familyController. Handles familyController responsibilities. */

const familyService = require('../services/familyService');
const { validateAddMember, validateMemberId } = require('../validators/familyValidator');
const { buildFamilyViewModel } = require('../viewModels/familyViewModel');
const { redirectError, redirectErrorWithParams } = require('./controllerHelpers');
const FALLBACK_ERROR = 'Operation failed';

// Get family members list
exports.getFamilyMembers = async (req, res, next) => {
  const user = req.session.user;
  if (!user || !user.familyId) {
    return redirectError(res, '/dashboard', 'Forbidden');
  }

  try {
    const rawMembers = await familyService.getMembersWithCountdown(user.familyId);
    const family = await familyService.getFamilyInfo(user.familyId);
    const viewModel = buildFamilyViewModel({
      user,
      family,
      rawMembers,
      query: req.query
    });

    res.render('pages/family/family', viewModel);
  } catch (error) {
    console.error('DB error:', error);
    next(error);
  }
};

// Get add member form
exports.getAddMember = (req, res) => {
  const user = req.session.user;
  if (!user) {
    return redirectError(res, '/family', 'Only family admins can add members');
  }
  res.redirect('/family?openAddMember=1');
};

// Post add member
exports.postAddMember = async (req, res) => {
  const user = req.session.user;
  if (!user || !user.familyId || !user.familyCode) {
    return redirectError(res, '/family', 'Only family admins can add members');
  }

  const validation = validateAddMember(req.body);
  if (!validation.ok) {
    return redirectErrorWithParams(res, '/family', {
      openAddMember: '1',
      addMemberError: validation.error,
      addMemberUsername: req.body.username || '',
      addMemberRole: req.body.role || ''
    });
  }

  try {
    const result = await familyService.addMember({
      familyId: user.familyId,
      familyCode: user.familyCode,
      customUsername: validation.value.customUsername,
      role: validation.value.role
    });

    const successMsg = encodeURIComponent(`Member ${result.username} created successfully`);
    res.redirect(`/family?message=${successMsg}`);
  } catch (error) {
    console.error('DB insert error:', error);
    redirectErrorWithParams(res, '/family', {
      openAddMember: '1',
      addMemberError: error.message || FALLBACK_ERROR,
      addMemberUsername: req.body.username || '',
      addMemberRole: req.body.role || ''
    });
  }
};

// Reset member password to initial password
exports.postResetMemberPassword = async (req, res) => {
  const user = req.session.user;

  if (!user || !user.familyId || !user.familyCode) {
    return redirectError(res, '/family', 'Forbidden');
  }

  const validation = validateMemberId(req.body);
  if (!validation.ok) {
    return redirectError(res, '/family', 'Member ID is required');
  }

  try {
    await familyService.resetMemberPassword({
      memberId: validation.value.memberId,
      familyId: user.familyId,
      familyCode: user.familyCode
    });

    res.redirect('/family?message=Password reset to family code');
  } catch (error) {
    console.error('Reset password error:', error);
    redirectError(res, '/family', error.message || FALLBACK_ERROR);
  }
};

// Disable member (soft delete with 3-day countdown)
exports.postDisableMember = async (req, res) => {
  const user = req.session.user;
  if (!user || !user.familyId) {
    return redirectError(res, '/family', 'Forbidden');
  }

  const validation = validateMemberId(req.body);
  if (!validation.ok) {
    return redirectError(res, '/family', 'Member ID is required');
  }

  try {
    await familyService.disableMember({ memberId: validation.value.memberId, familyId: user.familyId });
    res.redirect('/family?message=Member scheduled for deletion (3 days)');
  } catch (error) {
    console.error('Disable member error:', error);
    redirectError(res, '/family', error.message || FALLBACK_ERROR);
  }
};

// Restore member
exports.postRestoreMember = async (req, res) => {
  const user = req.session.user;
  if (!user || !user.familyId) {
    return redirectError(res, '/family', 'Forbidden');
  }

  const validation = validateMemberId(req.body);
  if (!validation.ok) {
    return redirectError(res, '/family', 'Member ID is required');
  }

  try {
    await familyService.restoreMember({ memberId: validation.value.memberId, familyId: user.familyId });
    res.redirect('/family?message=Member restored successfully');
  } catch (error) {
    console.error('Restore member error:', error);
    redirectError(res, '/family', error.message || FALLBACK_ERROR);
  }
};
