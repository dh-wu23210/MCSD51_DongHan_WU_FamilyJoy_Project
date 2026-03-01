/** Module: errorHandler. Handles errorHandler responsibilities. */

// Centralized error handler middleware
const { buildErrorViewModel } = require('../viewModels/errorViewModel');

module.exports = function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);

  // If response has already started, do not attempt to write headers/body again.
  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  if (req.accepts('html')) {
    return res.render('pages/error/error', buildErrorViewModel({ error: err }));
  } else {
    return res.json({ error: 'Internal Server Error' });
  }
};
