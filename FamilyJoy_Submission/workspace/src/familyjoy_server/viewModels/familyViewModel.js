/** Module: familyViewModel. Handles familyViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');

/**
 * buildFamilyViewModel: executes this module action.
 */
function buildFamilyViewModel(options) {
  const config = options || {};
  const user = config.user || {};
  const family = config.family || {};
  const rawMembers = config.rawMembers || [];
  const query = config.query || {};

  const members = rawMembers.map((member) => {
    const isMemberAdmin = member.is_admin === 1 || member.is_admin === true;
    const isDisabled = member.status === 'disabled';
    const hasDeleteCountdown = isDisabled && member.deleteCountdownDays !== null;
    const canModify = Boolean(user.isAdmin && !isMemberAdmin);
    const managementActions = [];
    if (canModify) {
      managementActions.push({
        key: 'reset',
        label: 'Reset',
        action: '/family/reset-member-password',
        confirm: 'Reset password to family code for this member?',
        buttonClass: 'btn btn-outline-danger'
      });
      if (isDisabled) {
        managementActions.push({
          key: 'restore',
          label: 'Restore',
          action: '/family/restore-member',
          confirm: 'Restore this member account?',
          buttonClass: 'btn btn-outline-success'
        });
      } else {
        managementActions.push({
          key: 'delete',
          label: 'Delete',
          action: '/family/disable-member',
          confirm: 'Delete this member? The account will be removed after 3 days.',
          buttonClass: 'btn btn-outline-secondary'
        });
      }
    }

    return {
      id: member.id,
      nickname: member.nickname || '-',
      username: member.username,
      passwordDisplay: member.is_initial_password ? (family.family_code || '') : '****',
      passwordStatusBadge: {
        label: member.is_initial_password ? 'Default' : 'Customised',
        className: member.is_initial_password ? 'text-bg-secondary' : 'text-bg-primary'
      },
      roleLabel: isMemberAdmin ? 'Admin' : (member.role === 'parent' ? 'Parent' : 'Child'),
      statusBadge: {
        label: isDisabled ? 'Disabled' : 'Active',
        className: isDisabled ? 'text-bg-secondary' : 'text-bg-success'
      },
      statusNote: hasDeleteCountdown ? `Delete in ${member.deleteCountdownDays} days` : '',
      canModify,
      managementActions
    };
  });

  return {
    ...buildPageDefaults({
      user,
      current: 'family',
      message: query.message || '',
      error: query.error || ''
    }),
    showAdminColumns: !!user.isAdmin,
    addMemberRoleOptions: [
      { value: 'child', label: 'Child', isSelected: (query.addMemberRole !== 'parent') },
      { value: 'parent', label: 'Parent', isSelected: (query.addMemberRole === 'parent') }
    ].map((option) => ({
      ...option,
      selectedAttr: option.isSelected ? 'selected' : ''
    })),
    members,
    familyName: family.name || 'Unknown',
    familyCode: family.family_code || '',
    openAddMember: query.openAddMember === '1',
    openAddMemberAttr: query.openAddMember === '1' ? '1' : '0',
    addMemberError: query.addMemberError || '',
    hasAddMemberError: Boolean(query.addMemberError),
    addMemberUsername: query.addMemberUsername || '',
    addMemberUsernameValue: query.addMemberUsername || ''
  };
}

module.exports = {
  buildFamilyViewModel
};
