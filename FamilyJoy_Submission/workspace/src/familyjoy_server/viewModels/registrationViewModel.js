/** Module: registrationViewModel. Handles registrationViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');

/**
 * buildRegisterFamilyViewModel: executes this module action.
 */
function buildRegisterFamilyViewModel(options) {
  const config = options || {};
  const message = config.message || '';
  const error = config.error || '';
  const formValues = config.formValues || {};
  return {
    ...buildPageDefaults({
      layout: 'layouts/nonavigated_layout',
      user: null,
      current: '',
      message,
      error
    }),
    hasMessage: Boolean(message),
    hasError: Boolean(error),
    errorMessage: error,
    formValues: {
      familyName: formValues.familyName || '',
      familyCode: formValues.familyCode || '',
      username: formValues.username || ''
    }
  };
}

module.exports = {
  buildRegisterFamilyViewModel
};
