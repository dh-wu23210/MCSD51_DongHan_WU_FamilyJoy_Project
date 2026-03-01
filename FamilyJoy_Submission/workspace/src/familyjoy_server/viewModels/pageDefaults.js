/** Module: pageDefaults. Handles pageDefaults responsibilities. */

function buildPageDefaults(options) {
  const config = options || {};
  return {
    layout: config.layout || 'layouts/navigated_layout',
    user: config.user || null,
    current: config.current || '',
    message: config.message || '',
    error: config.error || ''
  };
}

module.exports = {
  buildPageDefaults
};
