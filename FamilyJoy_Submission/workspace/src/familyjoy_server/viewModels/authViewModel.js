/** Module: authViewModel. Handles authViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');

/**
 * buildLoginViewModel: executes this module action.
 */
function buildLoginViewModel(options) {
  const config = options || {};
  const message = config.message || '';
  const error = config.error || '';
  return {
    ...buildPageDefaults({
      layout: 'layouts/nonavigated_layout',
      user: null,
      current: '',
      message,
      error
    }),
    attemptedUsername: config.attemptedUsername || '',
    attemptedUsernameValue: config.attemptedUsername || '',
    hasMessage: Boolean(message),
    hasError: Boolean(error),
    showNotRegModal: false
  };
}

module.exports = {
  buildLoginViewModel
};
