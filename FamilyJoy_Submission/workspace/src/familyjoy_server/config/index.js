/** Module: index. Handles index responsibilities. */

const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '..', '..', '.env');
dotenv.config({ path: envPath });

/**
 * requireEnv: executes this module action.
 */
function requireEnv(key, { allowEmpty = false, fallback } = {}) {
  const raw = process.env[key];
  if (raw === undefined || raw === null) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var ${key} (expected in ${envPath})`);
  }
  if (!allowEmpty && raw === '') {
    throw new Error(`Env var ${key} must not be empty`);
  }
  return raw;
}

/**
 * requireInt: executes this module action.
 */
function requireInt(key) {
  const raw = requireEnv(key);
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`${key} must be a valid integer`);
  }
  return parsed;
}

const config = {
  sessionSecret: requireEnv('SESSION_SECRET'),
  serverPort: requireInt('PORT'),
  db: {
    host: requireEnv('DB_HOST'),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD', { allowEmpty: true }),
    database: requireEnv('DB_NAME')
  }
};

const dbPort = process.env.DB_PORT;
if (dbPort !== undefined && dbPort !== null && dbPort !== '') {
  const parsedPort = parseInt(dbPort, 10);
  if (Number.isNaN(parsedPort)) {
    throw new Error('DB_PORT must be a valid integer');
  }
  config.db.port = parsedPort;
}

module.exports = config;
