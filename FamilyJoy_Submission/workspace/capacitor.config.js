const path = require('node:path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

function getEnv(key, { required = true, defaultValue } = {}) {
  const raw = process.env[key];
  if ((raw === undefined || raw === null || raw === '') && required && defaultValue === undefined) {
    throw new Error(`Missing env var ${key} (expected in ${envPath})`);
  }
  if ((raw === undefined || raw === null || raw === '') && defaultValue !== undefined) {
    return defaultValue;
  }
  return raw;
}

function getBooleanEnv(key, defaultValue) {
  const raw = process.env[key];
  if (raw === undefined || raw === null || raw === '') {
    return defaultValue;
  }
  return /^(1|true|yes)$/i.test(raw);
}

const config = {
  appId: getEnv('CAP_APP_ID'),
  appName: getEnv('CAP_APP_NAME'),
  webDir: getEnv('CAP_WEB_DIR', { defaultValue: 'src/familyjoy_client/public' })
};

const serverUrl = getEnv('CAP_SERVER_URL', { required: false });
if (serverUrl) {
  config.server = {
    url: serverUrl,
    cleartext: getBooleanEnv('CAP_SERVER_CLEARTEXT', true)
  };
}

module.exports = config;
