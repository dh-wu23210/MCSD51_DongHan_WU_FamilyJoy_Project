/** Module: errorViewModel. Handles errorViewModel responsibilities. */

const { buildPageDefaults } = require('./pageDefaults');

/**
 * buildErrorViewModel: executes this module action.
 */
function buildErrorViewModel(options) {
  const config = options || {};
  const error = config.error || null;
  const message = error && error.message ? error.message : 'An unexpected error occurred.';

  return {
    ...buildPageDefaults({
      layout: 'layouts/nonavigated_layout',
      user: null,
      current: '',
      message: '',
      error: ''
    }),
    errorMessage: message
  };
}

module.exports = {
  buildErrorViewModel
};
