/** Module: assets. Handles assets responsibilities. */

const manifest = require('../config/assets.manifest.json');

/**
 * getAssetPath: executes this module action.
 */
function getAssetPath(key, fallback = '') {
  if (!key) return fallback;
  const pathParts = String(key).split('.');
  let cursor = manifest;
  for (const part of pathParts) {
    if (!cursor || typeof cursor !== 'object' || !(part in cursor)) {
      return fallback;
    }
    cursor = cursor[part];
  }
  return typeof cursor === 'string' ? cursor : fallback;
}

module.exports = {
  assetsManifest: manifest,
  getAssetPath
};

