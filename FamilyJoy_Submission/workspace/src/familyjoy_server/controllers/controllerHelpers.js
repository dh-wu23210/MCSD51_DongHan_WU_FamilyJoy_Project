/** Module: controllerHelpers. Handles controllerHelpers responsibilities. */

function redirectError(res, path, message) {
  return res.redirect(`${path}?error=${encodeURIComponent(message)}`);
}

/**
 * redirectErrorWithParams: executes this module action.
 */
function redirectErrorWithParams(res, path, params) {
  const query = new URLSearchParams(params || {});
  return res.redirect(`${path}?${query.toString()}`);
}

module.exports = {
  redirectError,
  redirectErrorWithParams
};
